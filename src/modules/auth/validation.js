import joi from 'joi'

export const signUp = {

    body: joi.object({
        firstName: joi.string().min(3).max(20).pattern(new RegExp(/^[a-z ,.'-]+$/i)).required(),
        lastName: joi.string().min(3).max(10).pattern(new RegExp(/^[a-z ,.'-]+$/i)).required(),
        userName: joi.string().alphanum().min(3).max(20).required(),
        email: joi.string().email({ tlds: { allow: ["com", "org", "edu"] }, minDomainSegments: 2, maxDomainSegments: 5 }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required(),
        age: joi.number().integer().positive().min(18).max(99),
        gender: joi.string().valid("male", "female").required(),
        phone: joi.string().length(11).pattern(/^[0-9]+$/)
    }).required().options({ allowUnknown: false })
}

export const logIn = {
    body: joi.object({

        email: joi.string().email({ tlds: { allow: ["com", "net", "org", "edu"] }, minDomainSegments: 2, maxDomainSegments: 5 }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)).required()

    }).required().options({ allowUnknown: false })
}

export const confirmEmail = {
    params: joi.object({
        token:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    }).required()

}

export const newConfirmEmail = {

    params: joi.object({
        token:joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required()

}