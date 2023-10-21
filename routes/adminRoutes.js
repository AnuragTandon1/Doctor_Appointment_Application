const express =require('express')
const { getAllUsersController, getAllDoctorsController ,ChangeStatusController ,getAllpatientsController} = require('../controllers/adminCtrl')
const authMiddlewares = require('../middlewares/authMiddlewares')
const router =express.Router()



router.get('/getAllUsers',authMiddlewares,getAllUsersController)
router.get('/getAllDoctors',authMiddlewares,getAllDoctorsController)
router.post('/changeAccountStatus',authMiddlewares,ChangeStatusController)
router.get('/getAllPatients',authMiddlewares,getAllpatientsController)

module.exports=router