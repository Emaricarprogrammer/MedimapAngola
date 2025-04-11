FROM node:latest

WORKDIR /medmap_api

COPY . .

RUN rm -rf node_modules
RUN yarn install

CMD ["yarn", "start"]

EXPOSE 3000