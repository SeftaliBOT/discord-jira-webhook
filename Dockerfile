FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh make gcc g++ python libtool autoconf automake

WORKDIR /app
COPY package.json /app
# RUN npm install
COPY . /app

EXPOSE 3000
CMD ["npm", "start"]