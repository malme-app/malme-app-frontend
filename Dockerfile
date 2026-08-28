#######################
# malme fontend angular
#######################
FROM node:18.10-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG ANGULAR_CONFIG=production
RUN npx ng build --configuration ${ANGULAR_CONFIG}

FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
