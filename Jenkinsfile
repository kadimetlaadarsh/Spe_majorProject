pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'adarshareddy69'               // your Docker Hub username
    DOCKER_CRED_ID  = 'docker_hub'                   // existing Docker Hub credentials in Jenkins
    KUBECONFIG_ID   = 'kubeconfig-prod-cluster'      // existing kubeconfig file in Jenkins
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
          // Use git short SHA as an immutable tag (fallback to BRANCH_NAME if git unavailable)
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

    // -------------------------------
    // Auth service
    // -------------------------------
    stage('Build & Deploy: Auth Service') {
      when { changeset "services/auth-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/auth-service') {
              sh 'echo "Logging into Docker Hub..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/auth-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/auth-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/auth-service auth-service=${DOCKER_REGISTRY}/auth-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/auth-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Patient service
    // -------------------------------
    stage('Build & Deploy: Patient Service') {
      when { changeset "services/patient-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/patient-service') {
              sh 'echo "Building patient-service..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/patient-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/patient-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/patient-service patient-service=${DOCKER_REGISTRY}/patient-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/patient-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Scans service
    // -------------------------------
    stage('Build & Deploy: Scans Service') {
      when { changeset "services/scans-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/scans-service') {
              sh 'echo "Building scans-service..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/scans-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/scans-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/scans-service scans-service=${DOCKER_REGISTRY}/scans-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/scans-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Appointment service
    // -------------------------------
    stage('Build & Deploy: Appointment Service') {
      when { changeset "services/appointment-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/appointment-service') {
              sh 'echo "Building appointment-service..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/appointment-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/appointment-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/appointment-service appointment-service=${DOCKER_REGISTRY}/appointment-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/appointment-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Billing service
    // -------------------------------
    stage('Build & Deploy: Billing Service') {
      when { changeset "services/billing-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/billing-service') {
              sh 'echo "Building billing-service..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/billing-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/billing-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/billing-service billing-service=${DOCKER_REGISTRY}/billing-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/billing-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Prescription service
    // -------------------------------
    stage('Build & Deploy: Prescription Service') {
      when { changeset "services/prescription-service/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('services/prescription-service') {
              sh 'echo "Building prescription-service..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/prescription-service:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/prescription-service:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/prescription-service prescription-service=${DOCKER_REGISTRY}/prescription-service:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/prescription-service --timeout=180s
            """
          }
        }
      }
    }

    // -------------------------------
    // Frontend
    // -------------------------------
    stage('Build & Deploy: Frontend') {
      when { changeset "frontend/**" }
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: env.DOCKER_CRED_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
            file(credentialsId: env.KUBECONFIG_ID, variable: 'KUBECONFIG_FILE')
          ]) {
            dir('frontend') {
              sh 'echo "Building frontend..."'
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh "docker build -t ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} ."
              sh "docker push ${DOCKER_REGISTRY}/frontend:${IMAGE_TAG}"
            }
            sh """
              export KUBECONFIG=${KUBECONFIG_FILE}
              kubectl set image deployment/frontend frontend=${DOCKER_REGISTRY}/frontend:${IMAGE_TAG} --record || true
              kubectl rollout status deployment/frontend --timeout=180s
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
    }
  }
}
