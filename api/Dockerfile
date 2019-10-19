FROM node:12-stretch-slim

RUN mkdir -p /app/node && chown node:node /app/node

USER node

WORKDIR /app/node

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install 

COPY --chown=node:node . .

