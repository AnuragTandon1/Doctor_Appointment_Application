const mongoose =require('mongoose')
const colors =require('colors')

const connectDB=async()=>{
try {
  await mongoose.connect(process.env.DB_URI)
  console.log("Database connected")
} catch (error) {
    console.log(error)
}
}
module.exports=connectDB;