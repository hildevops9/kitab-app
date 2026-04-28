const express = require('express')
const router = express.Router()
router.get('/', (req, res) => res.json({ message: 'kitab ok' }))
module.exports = router
