import { auth } from "../../middleware/authentication.js"
import * as userController from "./controller/user.js"
import {validation} from "../../middleware/validation.js"
import * as validator from "./validation.js"
import { Router } from "express"
import { uploadFile, filteration} from "../../middleware/multer.js"
const router = Router()

//end points
router.get("/profile",[auth,validation(validator.Profile)],userController.Profile)
router.get("/getUsers",userController.getUsers)

router.get("/getPfp",[auth],userController.getPfp)
router.patch("/pfp",[auth,uploadFile(filteration.image).single("image")],userController.pfp)

router.get("/getCoverPhoto",[auth],userController.getCoverPhoto)
router.patch("/coverPhoto",[auth,uploadFile(filteration.image).array("image")],userController.coverPhoto)

router.put("/changePass",[auth,validation(validator.changePass)],userController.changePass)
router.put("/updateUser",[auth,validation(validator.updateUser)],userController.updateUser)
router.delete("/deleteUser",[auth,validation(validator.deleteUser)],userController.deleteUser)
router.put("/softDelete",[auth,validation(validator.softDeleteUser)],userController.softDeleteUser)
router.post("/forgotPassword",[validation(validator.forgotPassword)],userController.forgotPassword)
router.get("/resetPassword/:token",validation(validator.resetPassword),userController.resetPassword)
export default router