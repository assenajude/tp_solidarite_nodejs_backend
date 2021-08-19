const planCtrl = require('../controllers/plan.controller');
const express = require('express');
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')

const router = express.Router();

router.post('/',[verifyToken, isAdmin], planCtrl.createPlan);
router.get('/', planCtrl.getAllPlan)
router.delete('/deleteOne',[verifyToken, isAdmin], planCtrl.deletePlan)


module.exports = router