FROM node:alpine

USER node
WORKDIR /home/node/app

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
