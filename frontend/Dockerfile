# Stage 1 — build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Relative /api — nginx proxy handles routing, no hardcoded backend URL
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2 — nginx with PORT injected by Railway at runtime
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/nginx.conf.template
# Default PORT=3000 (matches Railway's assigned port for this service)
ENV PORT=3000
EXPOSE 3000
# Use envsubst with explicit '${PORT}' so ONLY PORT is replaced —
# nginx variables like $remote_addr, $uri are left untouched
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
