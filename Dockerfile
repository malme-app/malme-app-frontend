#######################
# malme fontend angular
#######################
FROM node:18.13-alpine as base
WORKDIR /app

RUN npm i -g @angular/cli@17.0.0
COPY ./package*.json ./
RUN  rm -rf node_modules && npm i

FROM base as build
COPY . .
RUN ng build  --configuration stg --output-path=./dist-build-by-docker

# NginX
FROM nginx:alpine as prod
COPY --from=build /app/dist-build-by-docker /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

