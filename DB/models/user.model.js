import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLogged: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    tasks: [
        { type: Types.ObjectId, ref: 'Task' } //to simulate a one to many relation between user and note
    ],
    pfp:{
        type:{secure_url:String,public_id:String}
    },
    coverPhotos:[{
        secure_url:String,public_id:String
    }]
    

},
    {
        timestamps: false
    }
)

const userModel = model('User', userSchema)
export default userModel