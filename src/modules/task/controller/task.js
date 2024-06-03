import taskModel from "../../../../DB/models/task.model.js";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import cloudinary from "../../utils/cloudinary.js"

export const addTask = asyncHandler(
    async (req, res, next) => {
        const { title, description, status, assignedId, deadline } = req.body
        const creatorId = req.user._id
        const checkUser = await userModel.findById(assignedId)
        if (!checkUser) {
            return next(new Error("User you're trying to assign task to does'nt exist!", { cause: 404 }))
        }
        const task = await taskModel.create({ title, description, status, creatorId, assignedId, deadline })

        const assignedToById = await userModel.findById(assignedId)
        assignedToById.tasks.push(task);
        await assignedToById.save();

        return res.json({ message: "done!", task })
    }
)

export const updateTask = asyncHandler(
    async (req, res, next) => {
        const { taskId } = req.params
        const creatorId = req.user._id
        const { title, description, status, assignedId } = req.body
        //getting the old assigned user id
        const oldAssigned = await taskModel.findOne({ _id: taskId })
        const checkUser = await userModel.findById(assignedId)
        if (!checkUser) {
            return next(new Error("User you're trying to assign task to does'nt exist!", { cause: 404 }))
        }
        const checkTaskOwner = await taskModel.findById(taskId)
        if (JSON.stringify(checkTaskOwner.creatorId) != JSON.stringify(creatorId)) {
            return next(new Error("This user does'nt own this task!", { cause: 403 }))
        }

        //updating task in database
        const task = await taskModel.updateOne({ _id: taskId }, { title, description, status, assignedId })
        const newTask = await taskModel.findOne({ _id: taskId })

        //for deleting from previous user task array
        const oldAssignedToById = await userModel.findById(oldAssigned.assignedId)
        const indexOfObject = oldAssignedToById.tasks.indexOf(taskId) //gets index of this note in the notes array in users schema with note id
        if (indexOfObject != -1) {
            oldAssignedToById.tasks.splice(indexOfObject, 1) //splice deletes this note from the specific place in user schema
            await oldAssignedToById.save();
        }

        //for inserting in new user task array
        const newAssignedToById = await userModel.findById(assignedId)
        newAssignedToById.tasks.push(newTask);
        await newAssignedToById.save();

        return task.modifiedCount ? res.status(200).json({ message: "task updated Successfully!" }) : res.status(404).json({ message: "no task was found!" })

    }
)

export const deleteTask = asyncHandler(
    async (req, res, next) => {
        const { taskId } = req.params
        const creatorId = req.user._id

        const checkTaskOwner = await taskModel.findById(taskId) //checking if the logged in account is indeed the task owner
        if (!checkTaskOwner) {
            return next(new Error("task doesn't exist!", { cause: 404 }))
        }
        if (JSON.stringify(checkTaskOwner.creatorId) != JSON.stringify(creatorId)) {
            return next(new Error("This user does'nt own this task!", { cause: 403 }))
        }

        //getting the task first to do some operations
        const taskFinder = await taskModel.findById(taskId)
        const assignedToById = await userModel.findById(taskFinder.assignedId)//getting the assigned-to user

        const indexOfObject = assignedToById.tasks.indexOf(taskFinder.id) //gets index of this note in the notes array in users schema with note id
        if (indexOfObject != -1) {
            assignedToById.tasks.splice(indexOfObject, 1) //splice deletes this note from the specific place in user schema
            await assignedToById.save();
        }
        if(taskFinder.attachments!=null){
            await cloudinary.api.delete_resources_by_prefix(`data/tasks/${taskFinder._id}`)
            await cloudinary.api.delete_folder(`data/tasks/${taskFinder._id}`)
        }
        const task = await taskModel.deleteOne({ _id: taskId })
        return task.deletedCount ? res.status(200).json({ message: "task deleted Successfully!" }) : res.status(404).json({ message: "no task was found!" })
    }
)

export const getAllTasksWithUserData = asyncHandler(
    async (req, res, next) => {
        const tasks = await taskModel.find().populate([{
            path: "assignedId"
        }])
        return res.status(200).json({ message: "Done!", tasks })
    }
)

export const getAllTasksOfLoggedInUser = asyncHandler(
    async (req, res, next) => {
        const assignedId = req.user._id
        const tasks = await taskModel.find({ assignedId })
        return res.status(200).json({ message: "Done!", tasks })
    }
)

export const getAllTasksOfOneUser = asyncHandler(
    async (req, res, next) => {
        const { assignedId } = req.params
        const tasks = await taskModel.find({ assignedId })
        return res.status(200).json({ message: "Done!", tasks })
    }
)

export const getAllTasksNotDoneAfterDeadline = asyncHandler(
    async (req, res, next) => {
        const tasks = await taskModel.find({ deadline: { $lt: new Date() }, status: { $ne: "done" } })
        return res.status(200).json({ message: "Done!", tasks })
    }
)

export const uploadAttachment = asyncHandler(
    async (req, res, next) => {
        const { taskId } = req.params
        const creatorId = req.user._id
        const checkTaskOwner = await taskModel.findById(taskId)
        if (!checkTaskOwner) {
            return next(new Error("either task is not owned by this user or task doesn't exist!", { cause: 404 }))
        }
        if (JSON.stringify(checkTaskOwner.creatorId) != JSON.stringify(creatorId)) {
            return next(new Error("This user does'nt own this task!", { cause: 403 }))
        }
        const attachments = checkTaskOwner.attachments
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `data/tasks/${taskId}/attachments` })
            attachments.push({ secure_url, public_id })
        }
        const task = await taskModel.updateOne({ _id: taskId }, { attachments: attachments })
        return task.modifiedCount ? res.json({ message: "Done!", attachments:attachments }) : next(new Error("couldnt find task!"), { cause: 404 })
    }
)

export const getAttachments = asyncHandler(
    async (req, res, next) => {
        const { taskId } = req.params
        const creatorId = req.user._id
        const checkTaskOwner = await taskModel.findById(taskId)
        if (!checkTaskOwner) {
            return next(new Error("task doesn't exist!", { cause: 404 }))
        }
        if (JSON.stringify(checkTaskOwner.creatorId) != JSON.stringify(creatorId)) {
            return next(new Error("This user does'nt own or belong to this task!", { cause: 403 }))
        }
        const task = await taskModel.findById(taskId)
        return res.json({ attachments: task.attachments })
    }
)