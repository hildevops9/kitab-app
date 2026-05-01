/**
 * Jalankan: node generate-icons.js
 * Butuh: npm install sharp
 *
 * Taruh file icon-base.png (1024x1024) di folder yang sama,
 * lalu jalankan script ini untuk generate semua ukuran icon.
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const inputFile = path.join(__dirname, 'icon-base.png')
const outputDir = path.join(__dirname, '../public/icons')

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

sizes.forEach(size => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}.png`))
    .then(() => console.log(`✅ icon-${size}.png`))
    .catch(err => console.error(`❌ ${size}:`, err))
})