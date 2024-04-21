# Setup image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# Start application
ADD start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ./start.sh
