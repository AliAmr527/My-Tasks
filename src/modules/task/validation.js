import joi from 'joi'

//this is the pattern for tokens generated by jwt token
//authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required() 

export const addTask ={
    body:joi.object({
        title:joi.string().min(3).max(20).required(),
        description:joi.string().max(300).required(),
        status:joi.string().valid("toDo", "doing","done").required(),
        assignedId:joi.string().regex(/^[a-z0-9]*$/).required(),
        deadline:joi.date()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required() 
    }).required()
}

export const updateTask = {
    body:joi.object({
        title:joi.string().min(3).max(20).regex(/^[a-zA-Z0-9]*$/).required(),
        description:joi.string().max(300).required(),
        status:joi.string().valid("toDo", "doing","done").required(),
        assignedId:joi.string().regex(/^[a-z0-9]*$/).required(),
        deadline:joi.date()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required(),
    params:joi.object({
        taskId:joi.string().regex(/^[a-z0-9]*$/).required(),
    }).required()
}

export const deleteTask = {
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required(),
    params:joi.object({
        taskId:joi.string().regex(/^[a-z0-9]*$/).required(),
    }).required()
}

export const getMyTasks = {
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const getTasksOfUser = {
    params:joi.object({
        assignedId:joi.string().regex(/^[a-z0-9]*$/).required(),
    }).required()
}