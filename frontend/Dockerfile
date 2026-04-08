# Stage 1 — build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=https://firedrive-production.up.railway.app/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2 — Express static server (reads process.env.PORT directly via Node.js)
FROM node:20-alpine
WORKDIR /app
RUN echo '{"name":"firedrive-fe","version":"1.0.0"}' > package.json && npm install express
COPY --from=builder /app/dist ./dist
COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
