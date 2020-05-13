#stage 1
FROM node:12.16.1-alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:1.18.0-alpine
COPY --from=node /app/dist/nine-gag-clone /usr/share/nginx/html
