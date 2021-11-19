FROM node:12-alpine3.14

WORKDIR /app
COPY app /app
RUN npm install -g supervisor
RUN npm install
CMD ["supervisor", "dist/index.js"]
#CMD ["node", "dist/index.js"]