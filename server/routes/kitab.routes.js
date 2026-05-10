const express = require('express')
const router = express.Router()
const { getAllKitab, getKitabBySlug, getKitabMateris } = require('../controllers/kitab.controller')
const { protect } = require('../middleware/auth.middleware')
const { optionalProtect } = require('../middleware/auth.middleware')

router.get('/', optionalProtect, /*protect,*/ getAllKitab)
router.get('/:slug/materis', /*protect,*/ optionalProtect, getKitabMateris)  // flat materi (untuk HIKAM)
router.get('/:slug', /*protect,*/ optionalProtect, getKitabBySlug)

module.exports = router