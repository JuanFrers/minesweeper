FROM node:6.3.0

WORKDIR /opt/app
EXPOSE 80
CMD ["npm", "start"]

COPY public ./public
COPY api ./api
COPY config ./config
COPY app.js .
COPY package.json .

RUN npm install
