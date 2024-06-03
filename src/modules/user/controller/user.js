import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/errorHandling.js"
import sendEmail from "../../utils/emailSending.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cloudinary from "../../utils/cloudinary.js"

export const Profile = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findOne({ _id: req.user._id, isDeleted: { $ne: "yes" } })
        if (!user) {
            return next(new Error("No User Found!", { cause: 404 }))
        }
        return res.json({ message: "done!", user })
    }
)

export const getUsers = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.find({ isDeleted: { $ne: "yes" } })
        return res.json({ message: "done!", user })
    }
)



export const changePass = asyncHandler(
    async (req, res, next) => {
        const { oldPassword, newPassword } = req.body
        const match = bcrypt.compareSync(oldPassword, req.user.password)
        if (!match) {
            return next(new Error("password do not match", { cause: 403 }))
        }
        const hashed = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUND))
        const changed = await userModel.updateOne({ _id: req.user._id }, { password: hashed })
        return changed.modifiedCount ? res.json({ message: "password changed successfully!" }) : next(new Error("no user was found!"))
    }
)

export const updateUser = asyncHandler(
    async (req, res, next) => {
        const { age, firstName, lastName, password } = req.body
        const match = bcrypt.compareSync(password, req.user.password)
        if (!match) {
            return next(new Error("password do not match", { cause: 403 }))
        }
        await userModel.updateOne({ _id: req.user._id }, { age, firstName, lastName })
        return res.json({ message: "user updated successfully!" })
    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) => {
        const { password } = req.body
        const match = bcrypt.compareSync(password, req.user.password)
        if (!match) {
            return next(new Error("password do not match", { cause: 403 }))
        }
        await userModel.deleteOne({ _id: req.user._id })
        if(req.user.pfp!=null){
            await cloudinary.api.delete_resources_by_prefix(`data/users/${req.user._id}`)
            await cloudinary.api.delete_folder(`data/users/${req.user._id}`)
        }
        return res.json({ message: "user deleted successfully" })
    }
)

export const softDeleteUser = asyncHandler(
    async (req, res, next) => {
        const { password } = req.body
        const match = bcrypt.compareSync(password, req.user.password)
        if (!match) {
            return next(new Error("password do not match", { cause: 403 }))
        }
        await userModel.updateOne({ _id: req.user._id }, { isDeleted: true ,isLogged:false})
        return res.json({ message: "user soft deleted susccessfully!" })
    }
)

export const forgotPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body
        const user = await userModel.findOne({ email: email })
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.PASSWORD_TOKEN_SIGNATURE)
        const html = `<h1>You're going to recieve a temporary password that you can change later</h1>
        <br><br>
        <a href="http://localhost:5000/user/resetPassword/${token}"> press me to reset your password</a>`
        sendEmail({ to: email, subject: "reset password", html: html })
        return res.status(200).json({ message: "check your email" })
    }
)

const randomizer = (length, arr, arrLength) => {
    let res = ''
    let counter = 0
    while (counter < length) {
        res += arr.charAt(Math.random() * arrLength)
        counter += 1
    }
    return res
}

const temporaryPassword = () => {
    const characters = 'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ',
        numbers = '1234567890',
        symbols = '!@#$%^&*';
    let Cresult = randomizer(6, characters, characters.length),
        Nresult = randomizer(6, numbers, numbers.length),
        Sresult = randomizer(3, symbols, symbols.length);
    return Cresult + Sresult + Nresult;
}

export const resetPassword = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.PASSWORD_TOKEN_SIGNATURE)
        const tempPassword = temporaryPassword()
        const hashed = bcrypt.hashSync(tempPassword, parseInt(process.env.SALT_ROUND))
        const user = await userModel.updateOne({ _id: decoded.id }, { password: hashed })
        return user.modifiedCount ? res.status(200).send(`<h1> your new temporary password is ${tempPassword}<h1>`) : next(new Error("couldnt find user!"), { cause: 404 })
    }
)

export const pfp = asyncHandler(
    async (req, res, next) => {
        if (req.user.pfp != null) {
            await cloudinary.uploader.destroy(req.user.pfp.public_id)
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `data/users/${req.user._id}/pfp` })
        const user = await userModel.updateOne({ _id: req.user._id }, { pfp: { secure_url, public_id } })

        return user.modifiedCount ? res.json({ message: "Done!", filePath: req.file, user }) : next(new Error("couldnt find user!"), { cause: 404 })
    }
)

export const getPfp = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findById(req.user._id)
        if (user) {
            return res.status(200).json({ Pfp: user.pfp })
        }
        next(new Error("couldnt find user!", { cause: 404 }))
    }
)

export const coverPhoto = asyncHandler(
    async (req, res, next) => {
        const images = req.user.coverPhotos
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `data/users/${req.user._id}/cover photos` })
            images.push({ secure_url, public_id })
        }
        const user = await userModel.updateOne({ _id: req.user._id }, { coverPhotos: images })
        return user.modifiedCount ? res.json({ message: "Done!", coverPhotos: req.user.coverPhotos }) : next(new Error("couldnt find user!"), { cause: 404 })
    }
)

export const getCoverPhoto = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findById(req.user._id)
        if (user) {
            return res.status(200).json({ coverPhotos: user.coverPhotos })
        }
        next(new Error("couldnt find user!", { cause: 404 }))
    }
)


