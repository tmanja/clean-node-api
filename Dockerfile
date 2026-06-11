FROM node:current
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --omit=dev
# COPY ./dist ./dist
# CMD [ "npm", "run", "start" ]