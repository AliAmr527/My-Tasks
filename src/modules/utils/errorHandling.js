export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            // return res.json({message:"hello",message:error.message})
            return next(new Error(error, { cause: 500 }))
        })
    }
}

export const globalErrorHandler = (error, req, res, next) => {
    return res.status(error.cause || 500).json({
        message: error.message,
        error,
        stack: error.stack
    })
}