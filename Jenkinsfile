pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'jyok1m/ipseis-frontend'
        DOCKER_TAG = "${env.BRANCH_NAME == 'main' ? 'latest' : 'dev'}"
        SSH_HOST = "host.docker.internal"

        // NEXT_PUBLIC_* restantes : inlinées dans le bundle au build, donc
        // résolues ici. BACKEND_URL n'y figure plus, elle est lue au runtime par
        // le conteneur (bloc `environment` du docker-compose de l'hôte) : la même
        // image peut ainsi être promue de dev vers prod sans rebuild.
        // Ce ne sont pas des secrets : pas de credential Jenkins requis.
        // Domaine canonique (balises canonical, sitemap, metadataBase). Le front
        // répond sur deux noms par environnement, mais un seul doit être déclaré
        // aux moteurs sous peine de contenu dupliqué : les autres redirigent en
        // 301 au niveau du reverse proxy.
        SITE_URL = "${env.BRANCH_NAME == 'main' ? 'https://ipseis.eu' : 'https://dev.ipseis.eu'}"
        CATALOGUE_PDF_ENABLED = "false"
    }

    stages {
        stage('Build') {
            when {
                anyOf {
                    branch 'dev'
                    branch 'main'
                }
            }
            steps {
                sh '''
                    docker build \
                        --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
                        --build-arg NEXT_PUBLIC_CATALOGUE_PDF_ENABLED="$CATALOGUE_PDF_ENABLED" \
                        -t $DOCKER_IMAGE:$DOCKER_TAG .
                '''
            }
        }

        stage('Publish') {
            when {
                anyOf {
                    branch 'dev'
                    branch 'main'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE:$DOCKER_TAG
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Dev') {
            when { branch 'dev' }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'host-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId: 'host-ssh-port', variable: 'HOST_PORT'),
                    usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        ssh -i "$SSH_KEY" -p "$HOST_PORT" \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$SSH_HOST" \
                            "set -e && \
                            echo '$DOCKER_PASS' | docker login -u '$DOCKER_USER' --password-stdin && \
                            docker compose -f /opt/ipseis/docker-compose.yml pull ipseis-web-dev && \
                            docker compose -f /opt/ipseis/docker-compose.yml up ipseis-web-dev -d && \
                            docker logout"
                    '''
                }
            }
        }

        stage('Deploy Prod') {
            when { branch 'main' }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'host-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId: 'host-ssh-port', variable: 'HOST_PORT'),
                    usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        ssh -i "$SSH_KEY" -p "$HOST_PORT" \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$SSH_HOST" \
                            "set -e && \
                            echo '$DOCKER_PASS' | docker login -u '$DOCKER_USER' --password-stdin && \
                            docker compose -f /opt/ipseis/docker-compose.yml pull ipseis-web && \
                            docker compose -f /opt/ipseis/docker-compose.yml up ipseis-web -d && \
                            docker logout"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh "docker rmi $DOCKER_IMAGE:$DOCKER_TAG || true"
        }
    }
}
