FROM node:14

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

RUN mkdir /usr/src/server/data

COPY . . 

CMD [ "node" , "index"]