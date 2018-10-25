def label = "pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    containers: [
        containerTemplate(name: 'node', image: 'node:boron', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true)
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node(label) {
        stage('Checkout Repo') {
            checkout scm
        }

        stage('Test Code') {
            container('node') {
                sh('npm install')
                sh('npm test')
            }
        }

        stage('Docker Build and Push') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                container('docker') {
                    sh("docker login -u ${USERNAME} -p ${PASSWORD}")
                    sh('docker build -t renansdias/calculator .')
                    sh('docker push renansdias/calculator')
                }
            }
        }
    }
}
