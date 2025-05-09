# 기본
FROM node:21 AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# development
FROM base AS development
ENV NODE_ENV=development
RUN npm install --only=development
CMD ["npm", "run", "start:dev"]

# production
FROM base AS production
ENV NODE_ENV=production
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]
