import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../modules/utils/errorHandling.js";
import jwt from "jsonwebtoken"
export const auth = asyncHandler(
    async (req, res, next) => {
        const { authorization } = req.headers
        
        if (!authorization?.startsWith(process.env.TOKEN_BEARER)) { //makes sure authorization key is sent from postman
            return next(new Error("authorization is required!", { cause: 401 }))
        }
        const token = authorization.split(process.env.TOKEN_BEARER)[1]
        if (!token) {
            return next(new Error("token is required", { cause: 401 }))
        }
        const decoded = jwt.verify(token, "hispowerisover9000")

        if (!decoded?.id) {//makes sure data is valid
            return next(new Error("invalid payload", { cause: 400 }))
        }
        const user = await userModel.findById(decoded.id)

        if (!user) {//makes sure there is a user with these credentials
            return next(new Error("User Doesnt Exist!", { cause: 404 }))
        }
        //////////
        if (!user.isLogged) {
            return next(new Error("User is not logged in!", { cause: 401 }))
        }
        if (user.isDeleted) {
            return next(new Error("User is soft deleted!", { cause: 404 }))
        }
        if (!user.confirmEmail) {
            return next(new Error("User has not confirmed his email!", { cause: 401 }))
        }
        ///////////
        //req.token = authorization
        req.user = user
        return next()
    }
)