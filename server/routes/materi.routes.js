const express = require('express')
const router = express.Router()
const { getMateriById, toggleComplete, toggleBookmark, getBookmarks } = require('../controllers/materi.controller')
const { protect } = require('../middleware/auth.middleware')
router.get('/bookmarks', protect, getBookmarks)
router.get('/:materiId', protect, getMateriById)
router.post('/:materiId/complete', protect, toggleComplete)
router.post('/:materiId/bookmark', protect, toggleBookmark)
module.exports = router
