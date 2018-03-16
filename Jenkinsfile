pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t hepcscreener .'
            }
        }
        stage('Publish') {
            steps {
                echo 'Publish to some docker swarm'
            }
        }
    }
}