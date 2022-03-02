FROM node:16-alpine3.12 as builder

ARG COLOR
ARG TITLE

ENV COLOR ${COLOR}
ENV TITLE ${TITLE}

WORKDIR /app

# First dependencies. for cache

COPY package*.json ./

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

COPY . .

RUN yarn build
RUN rm -rf node_modules 
RUN NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:16-alpine3.12

WORKDIR /app

RUN apk add dumb-init
RUN mkdir /data 
RUN chown node:node /data

COPY --from=builder --chown=node:node /app  .

ENV HOST 0.0.0.0
ENV NODE_ENV production
ENV LANG C.UTF-8

USER node
EXPOSE 3000
CMD ["dumb-init", "yarn", "start" ]
