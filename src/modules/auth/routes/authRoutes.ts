import { Router } from "express";

import { SessionController } from "../controllers/SessionController";

const authRoutes = Router()

const sessionController = new SessionController()

authRoutes.post("/", sessionController.handle)

export default authRoutes;