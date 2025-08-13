FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps

COPY . .

RUN ["npm", "run", "test"]
