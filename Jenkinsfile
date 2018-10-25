def label = "pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    serviceAccount: 'jenkins',
    containers: [
        containerTemplate(
            name: 'node',
            image: 'node:boron',
            ttyEnabled: true,
            command: 'cat'
        ),
        containerTemplate(
            name: 'docker',
            image: 'docker',
            ttyEnabled: true,
            command: 'cat'
        ),
        containerTemplate(
            name: 'helm',
            image: 'lachlanevenson/k8s-helm:v2.9.1',
            ttyEnabled: true,
            command: 'cat'
        )
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node(label) {
        stage('Checkout Repo') {
            checkout scm
        }

        stage('Run Tests') {
            container('node') {
                sh('npm install')
                sh('npm test')
            }
        }

        stage('Build and Push Image') {
            container('docker') {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                    sh("docker login -u $USERNAME -p $PASSWORD")
                    sh('docker build -t renansdias/calculator:latest .')
                    sh('docker push renansdias/calculator:latest')
                }
            }
        }

        stage('Deploy to Kubernetes') {
            container('helm') {
                sh('helm upgrade calculator chart/ --install --set image=renansdias/calculator:latest')
            }
        }
    }
}