FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN VITE_API_BASE_URL=/api npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /backend/package*.json ./
COPY --from=backend-builder /backend/node_modules ./node_modules
COPY --from=backend-builder /backend/dist ./dist
COPY --from=backend-builder /backend/prisma ./prisma
COPY --from=backend-builder /backend/prisma.config.ts ./prisma.config.ts
COPY --from=frontend-builder /frontend/dist ./dist/public

EXPOSE 8080
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/seed.js && node dist/index.js"]
