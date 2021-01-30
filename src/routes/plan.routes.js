const planCtrl = require('../controllers/plan.controller');
const multer = require('../middlewares/multer.config')
const express = require('express');
const router = express.Router();

router.post('/',multer, planCtrl.createPlan);
router.get('/', planCtrl.getAllPlan)


module.exports = router