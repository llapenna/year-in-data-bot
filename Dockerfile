FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build
RUN npx prisma generate

CMD ["npm", "start"]