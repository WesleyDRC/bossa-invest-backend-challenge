import { Router } from "express";

import userRoutes from "../../modules/users/routes/userRoutes";
import authRoutes from "../../modules/auth/routes/authRoutes";
import skillRoutes from "../../modules/skills/routes/skillRoutes";
import mentoringRoutes from "../../modules/mentoring/routes/mentoringRoutes";
import googleCalendarRoutes from "../../modules/calendar/integrations/google/routes/googleCalendarRoutes";

const routes = Router()

routes.get("/health-check", (request, response) => {
	response.json({ message: "Ok" })
})

routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/skills", skillRoutes)
routes.use("/mentoring", mentoringRoutes)
routes.use("/calendar", googleCalendarRoutes)

export default routes
