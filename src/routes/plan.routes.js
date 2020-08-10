const planCtrl = require('../controllers/plan.controller');
const express = require('express');
const router = express.Router();

router.post('/', planCtrl.createPlan);
router.get('/', planCtrl.getAllPlan)


module.exports = router