FROM node:20-alpine3.16

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY connect_db.js .
COPY ecosystem.config.js .
COPY .env .
COPY ./src ./src
COPY ./uploads ./uploads

RUN apk add python3
RUN npm install pm2 -g
RUN npm install

EXPOSE 3000

CMD ["pm2-runtime","start","ecosystem.config.js"]