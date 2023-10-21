const express =require('express')
const { loginController, registerController ,authCtrl ,applydoctorCtrl ,getAllNotificationCtrl ,deleteAllNotificationCtrl ,getAllDoctorsController ,bookappointmentController ,bookingAvailabilityController ,userAppointmentController} = require('../controllers/userCtrl')
const authMiddlewares = require('../middlewares/authMiddlewares')



const router =express.Router()
router.post("/login",loginController)
router.post("/register",registerController)
router.post("/getUserData",authMiddlewares,authCtrl)
router.post("/apply-doctor",authMiddlewares,applydoctorCtrl)
router.post("/get-all-notification",authMiddlewares,getAllNotificationCtrl)
// router.post("/delete-all-notification",authMiddlewares,deleteAllNotificationCtrl)
router.post("/delete-all-notification",authMiddlewares,deleteAllNotificationCtrl)
router.get('/getAllDoctors',authMiddlewares,getAllDoctorsController)
router.post('/book-appointment',authMiddlewares, bookappointmentController)
router.post(
    "/booking-availbility",
    authMiddlewares,
    bookingAvailabilityController
  );
  router.get('/user-appointments',authMiddlewares,userAppointmentController)
module.exports=router