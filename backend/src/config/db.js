mongoose= require("mongoose");
dotenv= require("dotenv");
dotenv.config();
const connect_db= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully🎉");
    }
    catch(err){
        console.log("Error connecting to db: ",err);
        process.exit(1);
    }
}
module.exports= connect_db;