def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    serviceAccount: 'jenkins',
    containers: [
        containerTemplate(name: 'node', image: 'node:boron', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'helm', image: 'lachlanevenson/k8s-helm:v2.9.1', command: 'cat', ttyEnabled: true)
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node(label) {
        stage('Checkout repo') {
            checkout scm
        }

        stage('Test API') {
            container('node') {
                sh('npm install')
                sh('npm test')
            }
        }

        stage('Build and Push Image') {
            container('docker') {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh("docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}")
                    sh('docker build -t renansdias/calculator .')
                    sh('docker push renansdias/calculator')
                }
            }
        }

        stage('Kubernetes Deploy') {
            container('helm') {
                sh('helm upgrade calculator chart/ --install --set image=renansdias/calculator')
            }   
        }
    }
}
