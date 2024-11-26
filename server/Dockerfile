FROM node:16

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./src ./src

CMD [ "npm", "run", "dev" ]
