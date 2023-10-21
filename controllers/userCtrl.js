const userModel =require('../models/userModels')
const bcrypt= require('bcryptjs')
const jwt =require('jsonwebtoken')
const doctorModel =require('../models/doctorModels')
const appointmentModel=require('../models/appointmentModels')
 const moment = require("moment");

const loginController =async(req ,res)=>{
    try {
        const user = await userModel.findOne({ email : req.body.email})
        if(!user){
            return res.status(200).send({success : false , message : `User not found`})
        }
        const isMatch =await bcrypt.compare(req.body.password , user.password)
        if(!isMatch){
            return res.status(200).send({success : false , message : `Invalid email or password`})
        }
        const token =jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '3d'})
        res.status(200).send({success : true , message : `Login success` ,token})
    } catch (error) {
        console.log(error)
        res.status(500).send({ message : `Error in login ${error.message}`})
    }
}
const registerController=async(req , res)=>{
    try {
        const existingUser = await userModel.findOne({ email : req.body.email})
        if(existingUser){
           return res.status(200).send({success : false , message : `User Already exist`})
        }
      const password= req.body.password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword= await bcrypt.hash(password,salt)
      req.body.password=hashedPassword
      const newUser=new userModel(req.body)
      await newUser.save()
      res.status(201).send({success : true , message : `Registered sucessfully`})
       
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false , message : `Register controller ${error.message}`})
    }
}
const authCtrl =async(req , res)=>{
try {
    const user =await userModel.findById({_id : req.body.userId})
    user.password =undefined
    if(!user ){
         return res.status(200).send({success : false , message : `User not found`})
       
    }
    else{
        res.status(200).send({success : true , data :user})
    }
} catch (error) {
    console.log(error)
    res.status(500).send({success : false , message : `auth error`})
}
} 
// const applydoctorCtrl=async(req , res)=>{
// try {
//     const newDoctor = await doctorModel({...req.body , status : 'pending'})
//     await newDoctor.save()
//     const adminUser =await userModel.find({isAdmin : true})
//     const notification =adminUser.notification 
//     notification.push({
//         type: "apply-doctor-request",
//         message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
//         data: {
//             doctorId: newDoctor._id,
//             name: newDoctor.firstName + " " + newDoctor.lastName,
//              onClickPath: "/admin/doctors",
//           },
//     })
//     await userModel.findByIdAndUpdate(adminUser._id, { notification });
//     res.status(201).send({
//         success: true,
//         message: "Doctor Account Applied SUccessfully",
//       });
// } catch (error) {
//     res.status(500).send({success : false ,error , message : `Error while applying for doctor`})
// }
// }
const applydoctorCtrl = async (req, res) => {
    try {
        const newDoctor = await doctorModel.create({ ...req.body, status: 'pending' });
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification || [];

        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/doctors",
            },
        });

        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).send({ success: false, error, message: "Error while applying for doctor" });
    }
};
const getAllNotificationCtrl=async(req,res)=>{
try {
    const user = await userModel.findOne({ _id: req.body.userId }); 
    const seennotification = user.seennotification;
    const notification =user.notification
    seennotification.push(...notification)
    user.seennotification=notification
    user.notification=[]
    
    const updatedUser=await user.save()
    res.status(200).send({
        success: true,
        message: "all notification marked as read",
        data: updatedUser,
      });
} catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error, message: "Error in notification" });
}
}
const deleteAllNotificationCtrl=async(req , res)=>{
try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];  
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
        success: true,
        message: "Notifications Deleted successfully",
        data: updatedUser,
      });
} catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });  
}
}
const getAllDoctorsController =async(req , res)=>{
    try {
        const doctors =  await doctorModel.find({ status : 'approved'})
        res.status(200).send({
            success: true,
            message: "Doctors List fetched Sucessfully",
            data: doctors,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error while fetching doctor",
        });
    }
    }
    const bookappointmentController=async(req , res)=>{
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
        type: "New-appointment-request",
        message: `A New Appointment Request from ${req.body.userInfo.name}`,
        onCLickPath: "/user/appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Book succesfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
    }
    const bookingAvailabilityController =async(req , res)=>{
       try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
              $gte: fromTime,
              $lte: toTime,
            },
          });
          if (appointments.length > 0) {
            return res.status(200).send({
              message: "Appointments not Availibale at this time",
              success: false,
            });
          } else {
            return res.status(200).send({
              success: true,
              message: "Appointments available",
            });
          }
       } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In Booking",
        });
       }
    }
    const userAppointmentController=async(req , res)=>{
try {
    const appointments = await appointmentModel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: "Users Appointments Fetch SUccessfully",
        data: appointments,
      });
} catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
}
    }
module.exports={loginController,registerController,authCtrl,applydoctorCtrl,getAllNotificationCtrl,deleteAllNotificationCtrl ,getAllDoctorsController,bookappointmentController,bookingAvailabilityController,userAppointmentController}