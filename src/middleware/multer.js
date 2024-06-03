import multer, { diskStorage } from "multer"

export const filteration = {
    image:["image/png","image/jpeg","image/gif"],
    file:["application/pdf","application/msword","text/plain","application/vnd.openxmlformats-officedocument.wordprocessingml.document","image/png","image/jpeg","image/gif"]
}


export const uploadFile = (filter) => {
    const storage = diskStorage({})
    
    const fileFilter = (req, file, cb) => {
        if (filter.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(new Error("invalid file format", false))
        }
    }

    const upload = multer({ storage, fileFilter })
    return upload
}


