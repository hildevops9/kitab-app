const express = require('express')
const router = express.Router()
router.get('/', (req, res) => res.json({ message: 'bab ok' }))
module.exports = router
