# ─────────────────────────────────────────────
# GitNova Backend - Production Dockerfile
# ─────────────────────────────────────────────

FROM node:20-alpine AS base

# ── Build stage ──────────────────────────────
FROM base AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install all dependencies (including devDependencies for tsc)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript and generate Prisma client
RUN npx prisma generate
RUN npm run build

# Prisma DB push (uses DATABASE_URL at build time)
# Uncomment if you want schema pushed at build:
# RUN npx prisma db push

# ── Production stage ─────────────────────────
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

# Copy built artifacts and production dependencies
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma/
COPY --from=builder --chown=appuser:appgroup /app/prisma.config.ts ./
COPY --from=builder --chown=appuser:appgroup /app/src/generated ./src/generated

USER appuser

EXPOSE 3001

CMD ["node", "dist/index.js"]
