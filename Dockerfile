#######################
# malme fontend angular
#######################
FROM node:21-alpine
RUN apk update && \
    apk upgrade && \
    apk add git && \
    npm install -g @angular/cli
EXPOSE 4200