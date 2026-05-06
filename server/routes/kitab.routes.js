const express = require('express')
const router = express.Router()
const { getAllKitab, getKitabBySlug, getKitabMateris } = require('../controllers/kitab.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', protect, getAllKitab)
router.get('/:slug/materis', protect, getKitabMateris)  // flat materi (untuk HIKAM)
router.get('/:slug', protect, getKitabBySlug)

module.exports = router