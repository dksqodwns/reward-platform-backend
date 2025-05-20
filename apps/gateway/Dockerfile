FROM node:18-alpine AS deps
WORKDIR /workspace/gateway
COPY package*.json nx.json ./
COPY tsconfig.base.json .

RUN mkdir -p node_modules/.cache
RUN npm ci

FROM deps AS builder
WORKDIR /workspace/gateway
COPY . .
RUN npx nx run gateway:build:production

FROM node:18-alpine AS runner
WORKDIR /app/gateway

COPY --from=builder /workspace/gateway/dist/apps/gateway ./dist
COPY --from=deps /workspace/gateway/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
