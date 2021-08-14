const planCtrl = require('../controllers/plan.controller');
const express = require('express');
const router = express.Router();

router.post('/',planCtrl.createPlan);
router.get('/', planCtrl.getAllPlan)
router.delete('/deleteOne', planCtrl.deletePlan)


module.exports = router