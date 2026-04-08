FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate
COPY . .
RUN npx tsc

EXPOSE 8080
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/seed.js && node dist/index.js"]
