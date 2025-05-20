FROM node:18-alpine AS builder
WORKDIR /app/auth
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:auth

FROM node:18-alpine
WORKDIR /app/auth
COPY --from=builder /app/auth/dist/apps/auth ./dist
COPY --from=builder /app/auth/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
