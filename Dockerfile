#######################
# malme fontend angular
#######################
FROM node:18.10-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
CMD ["npm", "run","start"]