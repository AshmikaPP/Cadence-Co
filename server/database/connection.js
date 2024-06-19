const mongoose=require('mongoose');

const connectDB=async()=>{
    try {
        const con= await mongoose.connect(process.env.MONGO_URL, { dbName: 'ash' })
        // console.log(`Mongo connected: ${con.connection.hos}`)
    } catch (error) {
       console.log(error)
       process.exit(1) 
    }
}

module.exports= connectDB 