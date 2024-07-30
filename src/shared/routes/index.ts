import { Router} from "express";

import userRoutes from "../../modules/users/routes/userRoutes";
import authRoutes from "../../modules/auth/routes/authRoutes";
import skillRoutes from "../../modules/skills/routes/skillRoutes";
import mentoringRoutes from "../../modules/mentoring/routes/mentoringRoutes";

const routes = Router()

routes.get("/health-check", (request, response) => {
	response.json({ message: "Ok"})
})

routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/skill", skillRoutes)
routes.use("/mentoring", mentoringRoutes)

export default routes
