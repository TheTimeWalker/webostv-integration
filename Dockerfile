FROM node:18 AS builder

WORKDIR /usr/src/app

COPY . .
RUN npm ci && npm run build

FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache bash

COPY package*.json entrypoint.sh ./
RUN npm ci --quiet --only=production && chmod +x entrypoint.sh

COPY --from=builder /usr/src/app/dist ./dist

CMD ./entrypoint.sh