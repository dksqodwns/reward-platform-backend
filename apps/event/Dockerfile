FROM node:18-alpine AS deps
WORKDIR /workspace/event
COPY package*.json nx.json ./
COPY tsconfig.base.json .

RUN mkdir -p node_modules/.cache
RUN npm ci

FROM deps AS builder
WORKDIR /workspace/event
COPY . .
RUN npx nx run event:build:production

FROM node:18-alpine AS runner
WORKDIR /app/event

COPY --from=builder /workspace/event/dist/apps/event ./dist
COPY --from=deps /workspace/event/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "dist/main.js"]
