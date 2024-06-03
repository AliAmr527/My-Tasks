import { asyncHandler } from "../../utils/errorHandling.js";
import userModel from "../../../../DB/models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createHtml } from "../../utils/html.js";
import sendEmail from "../../utils/emailSending.js";



export const signUp = asyncHandler(
    async (req, res, next) => {
        const { firstName, lastName, userName, email, password, age, gender, phone } = req.body
        const checkUser = await userModel.findOne({ email })
        if (checkUser) {
            return next(new Error("Email already exists!", { cause: 409 }))
        }
        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND)
        const user = await userModel.create({ firstName, lastName, userName, email, password: hashedPassword, age, gender, phone })

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_TOKEN_SIGNATURE, { expiresIn: 60 * 5 })
        const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_TOKEN_SIGNATURE, { expiresIn: 60 * 60 * 24 * 30 })

        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const newLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newToken}`
        console.log(link)
        const html = `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        <br><br>
        <a href="${newLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Verify Email address</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">

        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>

        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
        sendEmail({ to: email, subject: "Confirm Email", html: html })
        return res.status(201).json({ message: "Done", user })
    }
)

export const logIn = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body
        const checkUser = await userModel.findOne({ email })
        if (!checkUser) {
            return next(new Error("In-valid user Credentials!", { cause: 404 }))
        }
        if (checkUser.isDeleted) {
            return next(new Error("User is soft deleted!", { cause: 404 }))
        }
        if (!checkUser.confirmEmail) {
            return next(new Error("user did not confirm his E-mail!", { cause: 401 }))
        }
        const match = bcrypt.compareSync(password, checkUser.password)
        if (!match) {
            return next(new Error("In-valid user Credentials!", { cause: 404 }))
        }
        const token = jwt.sign(
            { id: checkUser._id }, process.env.TOKEN_SIGNATURE,
            { expiresIn: 60 * 60 * 24 }
        )
        await userModel.updateOne({ email }, { isLogged: true })
        return res.status(200).json({ message: "you're logged in successfully", token })
    }
)

export const logOut = asyncHandler(
    async (req, res, next) => {
        await userModel.findByIdAndUpdate(req.user._id, { isLogged: false })
        return res.status(200).json({ message: "User logged out successfully!" })
    }
)

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SIGNATURE)

        const user = await userModel.findByIdAndUpdate({ _id: decoded.id }, { confirmEmail: true })
        return user ? res.status(200).send(`<h1>Now you can <a href="${req.protocol}://${req.headers.host}/auth/logIn">Log-In</a> </h1>`) : res.send(`User Couldn't Be Found! Please <a href="http://localhost:5000/auth/signUp">Sign-Up</a> first!`)
    }
)

export const newConfirmEmail = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SIGNATURE)

        const user = await userModel.findById({ _id: decoded.id })
        if (!user) {
            res.status(200).send(`User Couldn't Be Found! Please <a href="${req.protocol}://${req.headers.host}/auth/signUp">Sign-Up</a> first!`)
        }
        if (user.confirmEmail) {
            return res.status(200).send(`<h1>your email is already confirmed please <a href="${req.protocol}://${req.headers.host}/auth/logIn">Log-In</a> </h1>`)
        }

        const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_TOKEN_SIGNATURE, { expiresIn: 60 * 2 })

        const link = `${req.protocol}://${req.headers.host}/auth/ConfirmEmail/${newToken}`
        const html = `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">

        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>

        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
        sendEmail({ to: user.email, subject: "Re-Confirm Email", html: html })
        res.send("<h1>check your inbox now!</h1>")
    }
)




