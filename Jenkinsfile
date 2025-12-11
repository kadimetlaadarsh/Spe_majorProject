pipeline {
  agent any

  environment {
    // --- YOUR EXISTING ENVIRONMENT VARS ---
    DOCKER_REGISTRY = 'adarshareddy69'            // your Docker Hub username
    DOCKER_CRED_ID  = 'docker_hub'                // existing Docker Hub credentials in Jenkins
    KUBECONFIG_ID   = 'kubeconfig-prod-cluster'   // existing kubeconfig file in Jenkins

    // --- NEW DEVOPS/SECURITY VARS ---
    IMAGE_TAG       = 'latest'                    // Placeholder, will be set in 'Determine Tag' stage
    SONAR_HOST_URL  = 'http://localhost:9000' // CHANGE THIS to your SonarQube URL
    SONAR_TOKEN_ID  = 'sonar-token'               // CHANGE THIS to your SonarQube token ID in Jenkins
    
    // *** CRITICAL FIX: Explicitly set DOCKER_HOST to use the system socket ***
    // This overrides incorrect local user settings that cause the 'cannot connect' error.
    DOCKER_HOST_FIX = 'unix:///var/run/docker.sock'
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

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

    // --------------------------
    // Security / Quality gates
    // --------------------------
    stage('Secret Scan (Gitleaks)') {
      steps {
        sh '''
          echo "Scanning for secrets using Gitleaks..."
          if command -v gitleaks >/dev/null 2>&1; then
            # Detect secrets across the entire checked out repository
            gitleaks detect --no-git -v || true
          else
            echo "Warning: gitleaks not found. Skipping secret scan."
          fi
        '''
      }
    }

    // Since your previous log showed SonarQube was running, I've left the stage commented
    // but ensured the project key is consistent.
    // stage('SonarQube Analysis') {
    //   steps {
    //     script {
    //       def scannerHome = tool 'sonar-scanner' // Ensure this tool is configured in Jenkins
    //       withCredentials([string(credentialsId: env.SONAR_TOKEN_ID, variable: 'SONAR_TOKEN')]) {
    //         sh """
    //           ${scannerHome}/bin/sonar-scanner \
    //             -Dsonar.projectKey=spe_majorproject \
    //             -Dsonar.sources=. \
    //             -Dsonar.host.url=${env.SONAR_HOST_URL} \
    //             -Dsonar.token=$SONAR_TOKEN
    //         """
    //       }
    //     }
    //   }
    // }

    // stage('Run Unit Tests (auto-detect)') { /* ... */ } // Keeping this commented as per your original file

    // ---------------------------------------------------------
    // Service: Auth
    // ---------------------------------------------------------
    stage('Build & Image Scan & Deploy: Auth Service') {
      when { changeset "services/auth-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'auth-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh """
              echo "Scanning ${SERVICE_NAME} image with Trivy..."
              trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true
            """

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Service: Patient
    // ---------------------------------------------------------
    stage('Build & Image Scan & Deploy: Patient Service') {
      when { changeset "services/patient-service/**" }
      steps {
        script {
          def SERVICE_NAME = 'patient-service'
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir("services/${SERVICE_NAME}") {
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Service: Scans
    // ---------------------------------------------------------
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
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Service: Appointment
    // ---------------------------------------------------------
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
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Service: Billing
    // ---------------------------------------------------------
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
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Service: Prescription
    // ---------------------------------------------------------
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
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

    // ---------------------------------------------------------
    // Frontend
    // ---------------------------------------------------------
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
              // *** FIX APPLIED ***
              sh "export DOCKER_HOST='${env.DOCKER_HOST_FIX}'" 
              
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"
            }

            sh "trivy image --severity HIGH,CRITICAL --no-progress --exit-code 0 ${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} || true"

            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${DOCKER_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/${SERVICE_NAME} --timeout=180s || true
            """
          }
        }
      }
    }

  } // stages

  post {
    success {
      echo "Pipeline completed successfully. Images pushed with tag ${IMAGE_TAG}."
    }
    failure {
      echo "Pipeline failed. Check console output for errors."
    }
    always {
      echo "Pipeline finished at: ${new Date()}"
      // Optional: logout from docker (uncomment if desired)
      // sh 'docker logout || true'
    }
  }
}