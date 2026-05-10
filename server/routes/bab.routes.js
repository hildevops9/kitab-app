const express = require('express')
const router = express.Router()
const { getMateriByBab } = require('../controllers/bab.controller')
const { protect } = require('../middleware/auth.middleware')
const { optionalProtect } = require('../middleware/auth.middleware')
router.get('/:kitabSlug/:babSlug', optionalProtect, protect, getMateriByBab)
module.exports = router
