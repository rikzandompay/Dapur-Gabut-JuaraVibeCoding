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
# (Penting untuk Next.js: pastikan `output: "standalone"` ada di next.config.mjs Anda)
RUN bun run build

# Tahap 3: Production Runner (Image paling ringan)
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Keamanan tambahan: Buat non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Setup permission untuk Next.js
RUN mkdir .next
RUN chown nextjs:bunjs .next

# Copy hasil build standalone Next.js
# (Ini membuat ukuran docker image sangat kecil karena hanya membawa file yang dibutuhkan)
COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

# Switch ke user non-root
USER nextjs

EXPOSE 8080

# Jalankan server Next.js standalone menggunakan Bun
CMD ["bun", "server.js"]

# ---------------------------------------------------------
# CATATAN: Jika Anda BELUM bermigrasi ke Next.js dan 
# masih menggunakan TanStack Start (seperti di kode Anda saat ini), 
# gunakan konfigurasi COPY & CMD di bawah ini sebagai gantinya:
#
# COPY --from=builder --chown=nextjs:bunjs /app/.output ./.output
# CMD ["bun", ".output/server/index.mjs"]
# ---------------------------------------------------------
