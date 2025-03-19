# Gunakan image Node.js terbaru dengan Alpine untuk ukuran yang lebih kecil
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm secara global
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies menggunakan pnpm
RUN pnpm install --frozen-lockfile --prod

# Salin seluruh project ke dalam container
COPY . .

# Set environment ke production
ENV NODE_ENV=production

# Expose port aplikasi
EXPOSE 3030

# Gunakan perintah start untuk menjalankan aplikasi
CMD ["pnpm", "start"]
