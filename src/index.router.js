import userRouter from "./modules/user/user.router.js"
import taskRouter from "./modules/task/task.router.js"
import authRouter from "./modules/auth/auth.router.js"
import connectDB from "../DB/connection.js"
import { globalErrorHandler } from "./modules/utils/errorHandling.js"

const bootstrap = (app, express) => {
	app.use(express.json())
	connectDB()
	app.use("/task", taskRouter)
	app.use("/user", userRouter)
	app.use("/auth", authRouter)
	app.use("/*", (req, res) => {
		return res.json({ message: "invalid routing!" })
	})
	app.use(globalErrorHandler)
}

export default bootstrap
