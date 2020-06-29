FROM node:14

LABEL github=https://github.com/pinpea

COPY src /nodejs/src
COPY tsconfig.json /nodejs/tsconfig.json
COPY package.json /nodejs/package.json
COPY swagger /nodejs/swagger
COPY jest.config.js /nodejs/jest.config.js
COPY tests /nodejs/tests
RUN mkdir /nodejs/dist

WORKDIR /nodejs

RUN npm install
RUN npx tsc -p /nodejs

EXPOSE 3100:3100

CMD ["npm", "start"]
