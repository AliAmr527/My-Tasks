import mongoose from "mongoose";

const connectDB = async () => {
    return await mongoose.connect(process.env.DB_URL).then(result => {
        console.log("connected to DB")
    }).catch(err => {
        console.log(`failed to connect to DB..... ${err}`)
    })
}

export default connectDB