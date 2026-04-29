const express = require('express')
const router = express.Router()
const { getBab } = require('../controllers/bab.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/:kitabSlug/:babSlug', protect, getBab)

module.exports = router