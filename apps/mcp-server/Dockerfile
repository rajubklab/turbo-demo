# pruner
FROM node:lts-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune mcp-server --docker

# installer
FROM node:lts-alpine AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# builder
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN npm install -g pnpm
RUN pnpm build

# runner
FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/mcp-server/.next/standalone/ ./
COPY --from=builder /app/apps/mcp-server/.next/static/ ./apps/mcp-server/.next/static
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/mcp-server/server.js"]
