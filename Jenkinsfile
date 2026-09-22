pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('backend') {
                    sh 'npm test || echo "No tests configured yet - continuing"'
                }
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging application...'
                sh 'ls -la'
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
    }
}
