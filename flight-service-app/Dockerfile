FROM node:14-alpine

WORKDIR /workspace

ENV HOST_ENVIRONMENT=docker

COPY package.json yarn.lock /workspace/

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]