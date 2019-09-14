FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["mongod", "npm", "start", "mongorestore -r world_sauces ./data/db/world_sauces"]
