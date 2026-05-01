const express = require('express')
const router = express.Router()
const { getMateriByBab } = require('../controllers/bab.controller')
const { protect } = require('../middleware/auth.middleware')
router.get('/:kitabSlug/:babSlug', protect, getMateriByBab)
module.exports = router
