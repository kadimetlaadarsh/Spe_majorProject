pipeline {
    agent any

    environment {
        // REPLACE WITH YOUR DOCKER HUB USERNAME
        DOCKER_REGISTRY = 'adarshareddy69' 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy Auth Service') {
            when {
                changeset "services/auth-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Auth Service'
                    dir('services/auth-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/auth-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/auth-service:latest"
                    }
                    sh "kubectl set image deployment/auth-service auth-service=${DOCKER_REGISTRY}/auth-service:latest"
                    sh "kubectl rollout status deployment/auth-service"
                }
            }
        }

        stage('Build and Deploy Patient Service') {
            when {
                changeset "services/patient-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Patient Service'
                    dir('services/patient-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/patient-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/patient-service:latest"
                    }
                    sh "kubectl set image deployment/patient-service patient-service=${DOCKER_REGISTRY}/patient-service:latest"
                    sh "kubectl rollout status deployment/patient-service"
                }
            }
        }

        stage('Build and Deploy Scans Service') {
            when {
                changeset "services/scans-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Scans Service'
                    dir('services/scans-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/scans-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/scans-service:latest"
                    }
                    sh "kubectl set image deployment/scans-service scans-service=${DOCKER_REGISTRY}/scans-service:latest"
                    sh "kubectl rollout status deployment/scans-service"
                }
            }
        }

        stage('Build and Deploy Appointment Service') {
            when {
                changeset "services/appointment-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Appointment Service'
                    dir('services/appointment-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/appointment-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/appointment-service:latest"
                    }
                    sh "kubectl set image deployment/appointment-service appointment-service=${DOCKER_REGISTRY}/appointment-service:latest"
                    sh "kubectl rollout status deployment/appointment-service"
                }
            }
        }

        stage('Build and Deploy Billing Service') {
            when {
                changeset "services/billing-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Billing Service'
                    dir('services/billing-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/billing-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/billing-service:latest"
                    }
                    sh "kubectl set image deployment/billing-service billing-service=${DOCKER_REGISTRY}/billing-service:latest"
                    sh "kubectl rollout status deployment/billing-service"
                }
            }
        }

        stage('Build and Deploy Prescription Service') {
            when {
                changeset "services/prescription-service/**"
            }
            steps {
                script {
                    echo 'Changes detected in Prescription Service'
                    dir('services/prescription-service') {
                        sh "docker build -t ${DOCKER_REGISTRY}/prescription-service:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/prescription-service:latest"
                    }
                    sh "kubectl set image deployment/prescription-service prescription-service=${DOCKER_REGISTRY}/prescription-service:latest"
                    sh "kubectl rollout status deployment/prescription-service"
                }
            }
        }

        stage('Build and Deploy Frontend') {
            when {
                changeset "frontend/**"
            }
            steps {
                script {
                    echo 'Changes detected in Frontend'
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_REGISTRY}/frontend:latest ."
                        sh "docker push ${DOCKER_REGISTRY}/frontend:latest"
                    }
                    sh "kubectl set image deployment/frontend frontend=${DOCKER_REGISTRY}/frontend:latest"
                    sh "kubectl rollout status deployment/frontend"
                }
            }
        }
    }
}
