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

# Stage 2 — nginx with dynamic PORT from Railway env var
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Place config in templates/ — nginx:alpine auto-runs envsubst on startup
COPY nginx.conf /etc/nginx/templates/default.conf.template
# nginx:alpine listens on $PORT (injected by Railway); default 3000 for local
ENV PORT=3000
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
