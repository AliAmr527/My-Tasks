import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["toDo", "doing", "done"]
    },
    creatorId: {
        type: Types.ObjectId, ref: 'User', //to simulate a many to one relation between note and user
        required: true
    },
    assignedId: {
        type: Types.ObjectId, ref: 'User', //to simulate a many to one relation between note and user
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    attachments:[{
        secure_url:String,public_id:String
    }]
},
    {
        timestamps: true
    }
)

const taskModel = model('Task', taskSchema)
export default taskModel