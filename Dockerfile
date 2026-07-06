# syntax=docker/dockerfile:1.4

# ─── Base: pnpm setup (shared) ───────────────────────────────────────────────
FROM node:22-alpine AS base

RUN npm install -g pnpm@9

# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile && \
    npx prisma generate

# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# build:swc skips prebuild (eslint/prettier) — safe for CI
RUN pnpm run build:swc

# ─── Stage 3: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

LABEL org.opencontainers.image.source="https://github.com/Jamalov07/ramz-group"
LABEL org.opencontainers.image.description="Ramz Group NestJS API"

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache curl

# Copy only what's needed at runtime
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY package.json ./

RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

# prisma db push — runs schema sync at startup (needs DATABASE_URL from env)
CMD ["sh", "-c", "npx prisma db push && node dist/main"]
