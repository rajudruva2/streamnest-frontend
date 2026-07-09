pipeline {

    agent any

    environment {

        IMAGE_NAME = "rajvam6806/streamnest-frontend"

        TAG = "${BUILD_NUMBER}"

    }

    stages {

        stage('Checkout') {

            steps {

                checkout scm

            }

        }

        stage('Install') {

            steps {

                sh 'npm install'

            }

        }

        stage('Build') {

            steps {

                sh 'npm run build'

            }

        }

        stage('Docker Build') {

            steps {

                sh 'docker build -t ${IMAGE_NAME}:${TAG} .'
            }

        }

        stage('Docker Login') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {

                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {

            steps {

                sh 'docker push ${IMAGE_NAME}:${TAG}'
                sh 'docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest'
                sh 'docker push ${IMAGE_NAME}:latest'

            }

        }
    stage('Deploy to EKS') {
    steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {

            sh '''
                kubectl get nodes

                kubectl apply -f k8s/

                kubectl get pods -n streamnest

                kubectl get svc -n streamnest
            '''
        }
    }
}
        

    }

}
