# syntax=docker/dockerfile:1.2
FROM node:14 as builder

# Build the frontend application
WORKDIR /frontend
COPY ./package.json .
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

# EXTERNAL STAGE
FROM nginx:stable-alpine

COPY --from=builder /frontend/build /usr/share/nginx/html/auth

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]