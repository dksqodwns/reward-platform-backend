FROM node:18-alpine AS builder
WORKDIR /app/gateway
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:gateway

FROM node:18-alpine
WORKDIR /app/gateway
COPY --from=builder /app/gateway/dist/apps/gateway ./dist
COPY --from=builder /app/gateway/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
