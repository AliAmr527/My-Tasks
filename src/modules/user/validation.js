import joi from 'joi'

export const Profile ={
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const changePass = {
    body:joi.object({
        oldPassword:joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required(),
        newPassword:joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const updateUser = {
    body:joi.object({
        firstName: joi.string().min(3).max(20).pattern(new RegExp(/^[a-z ,.'-]+$/i)).required(),
        lastName: joi.string().min(3).max(10).pattern(new RegExp(/^[a-z ,.'-]+$/i)).required(),
        age: joi.number().integer().positive().min(18).max(99).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const deleteUser ={
    body:joi.object({
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const softDeleteUser ={
    body:joi.object({
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required()
    }).required(),
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const forgotPassword = {
    body:joi.object({
        email: joi.string().email({ tlds: { allow: ["com", "org", "edu"] }, minDomainSegments: 2, maxDomainSegments: 5 }).required(),
    }).required()
    ,
    headers:joi.object({
        authorization:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}

export const resetPassword = {
    params:joi.object({
        token:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()
}