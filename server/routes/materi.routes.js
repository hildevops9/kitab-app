const express = require('express')
const router = express.Router()
const { getMateri, markComplete } = require('../controllers/materi.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/:id', protect, getMateri)
router.post('/:id/complete', protect, markComplete)

module.exports = router