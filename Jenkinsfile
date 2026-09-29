pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "srivineeth/week9-app"
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        APP_PORT   = "3001"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies from lockfile...'
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Dependency Audit') {
            steps {
                echo 'Auditing npm dependencies...'
                dir('backend') {
                    sh 'npm audit --omit=dev --audit-level=high'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                dir('backend') {
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .'
                }
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning image with Trivy (fails on HIGH/CRITICAL)...'
                sh 'trivy image --no-progress --scanners vuln --severity HIGH,CRITICAL --exit-code 1 $IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying container...'
                sh 'docker rm -f week9-app || true'
                sh 'docker run -d --name week9-app --restart unless-stopped -p $APP_PORT:3000 $IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Smoke Test') {
            steps {
                echo 'Checking that the app responds...'
                sh 'for i in $(seq 1 10); do curl -fs localhost:$APP_PORT && exit 0; sleep 3; done; exit 1'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed - check logs above.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}
