pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t apps2.hdap.gatech.edu/hep-c-screener .'
            }
        }
        stage('Publish') {
            steps {
                echo 'Publish to some docker swarm'
            }
        }
    }
}