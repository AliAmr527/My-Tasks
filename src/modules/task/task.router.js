import { auth } from "../../middleware/authentication.js"
import * as taskController from "./controller/task.js"
import { validation } from "../../middleware/validation.js"
import * as validator from "./validation.js"
import { Router } from "express"
import { uploadFile,filteration} from "../../middleware/multer.js"
const router = Router()

//end points
router.post("/addTask", [auth, validation(validator.addTask)], taskController.addTask)
router.put("/updateTask/:taskId", [auth,validation(validator.updateTask)], taskController.updateTask)
router.delete("/deleteTask/:taskId", [auth,validation(validator.deleteTask)], taskController.deleteTask)
router.get("/getAllTasks", taskController.getAllTasksWithUserData)
router.get("/getMyTasks", [auth,validation(validator.getMyTasks)], taskController.getAllTasksOfLoggedInUser)
router.get("/getTasksOfUser/:assignedId",validation(validator.getTasksOfUser), taskController.getAllTasksOfOneUser)
router.get("/getTasksNotDone", taskController.getAllTasksNotDoneAfterDeadline)

router.patch("/attachment/:taskId",[auth,uploadFile(filteration.file).array("attachment")],taskController.uploadAttachment)
router.get("/getAttachments/:taskId",[auth],taskController.getAttachments)

export default router