# Base image ringan dengan Bun bawaan
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Tahap 1: Install Dependencies
FROM base AS deps
COPY package.json bun.lockb* ./
# Install dependencies menggunakan bun
RUN bun install --frozen-lockfile

# Tahap 2: Build Aplikasi
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Tahap 3: Production Runner (Image paling ringan)
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Salin folder dist hasil build dan file server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js

# PENTING: Salin node_modules agar server bisa berjalan
COPY --from=builder /app/node_modules ./node_modules

# Gunakan user non-root 'bun' bawaan dari image oven/bun
USER bun

EXPOSE 8080

# Jalankan server menggunakan script start yang sudah disiapkan
CMD ["bun", "run", "start"]