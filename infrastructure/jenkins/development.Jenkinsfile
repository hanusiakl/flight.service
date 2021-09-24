def productVersion = env.BUILD_NUMBER
def label = "development-job-flight-service-app-${UUID.randomUUID().toString()}"

podTemplate(
    label: label, 
    containers: [
        containerTemplate(
            name: 'node14', 
            image: 'node:14-alpine', 
            command: 'cat', 
            ttyEnabled: true, 
            resourceRequestCpu: '900m', 
            resourceLimitCpu: '1000m', 
            resourceRequestMemory: '2000Mi',
            resourceLimitMemory: '2500Mi'),
        containerTemplate(
            name: 'docker', 
            image: 'docker', 
            command: 'cat', 
            ttyEnabled: true),
        containerTemplate(
            name: 'kubectl', 
            image: 'lachlanevenson/k8s-kubectl:v1.8.8',
            command: 'cat', 
            ttyEnabled: true)
    ],
    volumes: [
        hostPathVolume(mountPath: '/home/gradle/.gradle', hostPath: '/tmp/jenkins/.gradle'),
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) 
{
    node(label) {
        stage('build: checkout files') {
        }
        stage('build: install dependencies') {
            container('node14') {
                sh "cd flight-service-app && npm i"
            }
        }
        stage('build: service') {
            container('node14') {
                sh "cd flight-service-app && npm run build"
            }
        }
        stage('test: unit tests') {
            container('node14') {
                try {
                    sh "cd flight-service-app && && npm run test"
                } catch(ex) {
                    currentBuild.result = 'UNSTABLE'
                }
            }
        }
		stage('docker image: create') {
			container('docker') {
				sh "cd flight-service-app && npm run docker:build"
			}
		}
		stage('docker image: tag') {
			container('docker') {
				sh "cd flight-service-app && npm run docker:tag"
			}
		}
		stage('image: publish') {
			container('docker') {
				sh "cd flight-service-app && npm run docker:push"
			}
		}
		stage('deployment') {
			container('kubectl') {
                try {
                    sh "cd infrastructure/kubernetes/development && kubectl delete -f ."
                } catch (ex) {
                    currentBuild.result = 'UNSTABLE'
                }
                try {
                   sh "cd infrastructure/kubernetes/development && kubectl apply -f ."
                } catch (ex) {
                    currentBuild.result = 'UNSTABLE'
                }
            }
		}
    }
}
