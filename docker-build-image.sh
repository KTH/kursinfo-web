#!/bin/bash

ENV=$1

function echoYellow() {
  MSG=$1
  printf "\033[1;33m$MSG\033[0m\n"
}

echo
echoYellow "|--------------------------------------------------------|"
echoYellow "|    Building the Docker image for development env       |"   
echoYellow "|--------------------------------------------------------|\n"

IMAGE_NAME="kursinfo-web-image"
DOCKERFILE="Dockerfile-dev"


if [ "$ENV" == "dev" ]; then

  echo
  echoYellow "  1. Creating Dockerfile-dev for development environment\n"
  
  cp Dockerfile "$DOCKERFILE"
  sed -i '' 's/CMD \["npm", "start"\]/CMD ["npm", "run", "docker:start"]/g' "$DOCKERFILE"

  echo
  echoYellow "  2. Stop previous Docker image: a name tag is $IMAGE_NAME\n"
  docker stop "$IMAGE_NAME"

  echo
  echoYellow "  3. Remove previous Docker image: a name tag is $IMAGE_NAME\n"
  docker rmi "$IMAGE_NAME"

  echo
  echoYellow "  4. Build Docker image: a name tag is $IMAGE_NAME\n"
  docker build -f Dockerfile-dev -t "$IMAGE_NAME" .

  echo
  echoYellow "  5. List images\n"
  docker images
fi
