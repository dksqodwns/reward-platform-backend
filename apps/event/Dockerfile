FROM node:18-alpine AS builder
WORKDIR /app/event
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:event

FROM node:18-alpine
WORKDIR /app/event
COPY --from=builder /app/event/dist/apps/event ./dist
COPY --from=builder /app/event/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "dist/main.js"]
