const mongoose=require('mongoose');

const connectDB=async()=>{
    try {
        // const con=await mongoose.connect(process.env.MONGO_URI)
        const con= await mongoose.connect("mongodb://127.0.0.1:27017/ash")
        // console.log(`Mongo connected: ${con.connection.hos}`)
    } catch (error) {
       console.log(error)
       process.exit(1) 
    }
}

module.exports= connectDB 