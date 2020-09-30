FROM node:lts-alpine

WORKDIR /emulator

COPY src ./src
COPY dist ./dist

COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .npmignore ./

COPY package*.json ./

RUN ["npm", "install"]

ENTRYPOINT [ "npm", "start" ]