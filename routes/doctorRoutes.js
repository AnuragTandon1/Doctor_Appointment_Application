const express = require("express");
const { getDoctorInfoController , updateProfileController , getDoctorByIdController ,doctorappointmentController ,updatestatusController  } = require("../controllers/doctorCtrl");
const authMiddlewares = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post('/getDoctorInfo',authMiddlewares,getDoctorInfoController)
router.post('/updateProfile',authMiddlewares,updateProfileController)
router.post('/getDoctorById',authMiddlewares,getDoctorByIdController)
router.get('/doctor-appointments',authMiddlewares,doctorappointmentController)
router.post('/update-status',authMiddlewares,updatestatusController)
module.exports=router