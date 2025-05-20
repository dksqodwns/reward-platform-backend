FROM node:18-alpine AS deps
WORKDIR /workspace/auth
COPY package*.json nx.json ./
COPY tsconfig.base.json .

RUN mkdir -p node_modules/.cache
RUN npm ci

FROM deps AS builder
WORKDIR /workspace/auth
COPY . .
RUN npx nx run auth:build:production

FROM node:18-alpine AS runner
WORKDIR /app/auth

COPY --from=builder /workspace/auth/dist/apps/auth ./dist
COPY --from=deps /workspace/auth/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
