stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Determine Tag') {
      steps {
        script {
          def sha = ''
          try {
            sha = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          } catch (err) {
            echo "git rev-parse failed, falling back to branch name"
            sha = env.BRANCH_NAME ?: 'latest'
          }
          env.IMAGE_TAG = sha
          echo "Using image tag: ${env.IMAGE_TAG}"
        }
      }
    }
    
    stage('Secret Scan (Gitleaks)') {
      steps {
        sh '''
          echo "Scanning for secrets using Gitleaks..."
          if command -v gitleaks >/dev/null 2>&1; then 
            gitleaks detect --no-git -v || true 
          else
            echo "Warning: gitleaks not found. Skipping secret scan."
          fi
        '''
      }
    }

    stage('SonarQube Analysis') {
      steps {
        script {
          def scannerHome = tool 'sonar-scanner' 
          withCredentials([string(credentialsId: env.SONAR_TOKEN_ID, variable: 'SONAR_TOKEN')]) { 
            sh """
              ${scannerHome}/bin/sonar-scanner \
              -Dsonar.projectKey=spe_majorproject \
              -Dsonar.sources=. \
              -Dsonar.host.url=${env.SONAR_HOST_URL} \
              -Dsonar.token=$SONAR_TOKEN
            """
          }
        }
      }
    }
    
    // ------------------------------------------------------------------
    // ALL SERVICES - BUILD, SCAN, DEPLOY
    // ------------------------------------------------------------------

    stage('Build & Image Scan & Deploy: Auth Service') {
      when { changeset "services/auth-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'auth-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            // ... (Steps for Auth Service: Build, Scan, Deploy)
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }
    
    stage('Build & Image Scan & Deploy: Patient Service') {
      when { changeset "services/patient-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'patient-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            // ... (Steps for Patient Service: Build, Scan, Deploy)
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }
    
    // --- MISSING STAGE 1: Scans Service ---
    stage('Build & Image Scan & Deploy: Scans Service') {
      when { changeset "services/scans-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'scans-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }

    // --- MISSING STAGE 2: Appointment Service ---
    stage('Build & Image Scan & Deploy: Appointment Service') {
      when { changeset "services/appointment-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'appointment-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }
    
    // --- MISSING STAGE 3: Billing Service ---
    stage('Build & Image Scan & Deploy: Billing Service') {
      when { changeset "services/billing-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'billing-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }

    // --- MISSING STAGE 4: Prescription Service ---
    stage('Build & Image Scan & Deploy: Prescription Service') {
      when { changeset "services/prescription-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'prescription-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }

    // --- Frontend Stage ---
    stage('Build & Image Scan & Deploy: Frontend') {
      when { changeset "frontend/**" }
      steps {
        script {
          def SERVICE_NAME = 'frontend'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("${SERVICE_NAME}") {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }
            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"
            sh "export KUBECONFIG=${KUBECONFIG_FILE}; kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true; kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s"
          }
        }
      }
    }
  } // stages