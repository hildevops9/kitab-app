const express = require('express')
const router = express.Router()
router.get('/', (req, res) => res.json({ message: 'question ok' }))
module.exports = router
