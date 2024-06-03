import { auth } from "../../middleware/authentication.js"
import * as authController from "./controller/auth.js"
import * as validators from "./validation.js"
import {Router} from "express"
import { validation } from "../../middleware/validation.js"
const router = Router()

router.post("/signUp",validation(validators.signUp),authController.signUp)
router.post("/logIn",validation(validators.logIn),authController.logIn)
router.put("/logOut",auth,authController.logOut)
router.get("/confirmEmail/:token",validation(validators.confirmEmail),authController.confirmEmail)
router.get("/newConfirmEmail/:token",validation(validators.newConfirmEmail),authController.newConfirmEmail)


export default router