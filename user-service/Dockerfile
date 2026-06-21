
FROM node:20-alpine AS runner

WORKDIR /app


ENV NODE_ENV=production

COPY package*.json ./


RUN npm ci --only=production


COPY . .


EXPOSE 5002


CMD ["node", "src/server.js"]