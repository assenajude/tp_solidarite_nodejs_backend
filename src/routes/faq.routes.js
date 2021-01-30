const express = require('express')
const router = express.Router()
const faqCtrl = require('../controllers/faq.controller')

router.post('/questions', faqCtrl.askQuestion)
router.get('/questions', faqCtrl.getAllQuestions)
router.patch('/questions/edit', faqCtrl.editQuestion)
router.post('/responses', faqCtrl.giveResponse)

module.exports = router