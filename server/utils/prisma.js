const { PrismaClient } = require('@prisma/client')

/**
 * Prisma Singleton — WAJIB untuk Vercel serverless
 *
 * Tanpa ini, setiap cold start (atau hot reload) membuat PrismaClient baru
 * yang berarti koneksi baru ke Supabase = 15-17 detik.
 *
 * Dengan menyimpan instance di `global`, koneksi yang sudah ada
 * akan di-reuse selama function container masih hidup.
 */
const globalForPrisma = global

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

const prisma = globalForPrisma.prisma

module.exports = prisma