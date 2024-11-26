FROM node:16
WORKDIR /usr/src/app

COPY . .
RUN npm install --fprce
RUN npm run build
CMD ['npm','start']
