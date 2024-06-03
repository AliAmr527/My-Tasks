const dataMethods = ['body', 'params', 'query', 'header', 'file']

export const validation = (JoiSchema) => { //validation with the first solution
    return (req, res, next) => {
        const validationErr = []

        dataMethods.forEach(key => {
            if (JoiSchema[key]) {
                const validationResult = JoiSchema[key].validate(req.body, { abortEarly: false })
                
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        });

        if (validationErr.length > 0){
            return res.json({message:"Validation Error",validationErr})
        }
            return next()
    }
}