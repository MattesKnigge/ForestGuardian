FROM node:latest

EXPOSE 3000

WORKDIR /usr/src/app

COPY frontend .
RUN npm install --progress=false
RUN npm run build


CMD [ "npm", "start" ]

