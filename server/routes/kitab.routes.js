const express = require('express')
const router = express.Router()
const { getAllKitab, getKitabBySlug } = require('../controllers/kitab.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', protect, getAllKitab)
router.get('/:slug', protect, getKitabBySlug)

module.exports = router