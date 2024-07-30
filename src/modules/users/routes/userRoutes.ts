import { Router } from "express";

import { CreateUserController } from "../controllers/CreateUserController";
import { AddSkillUserController } from "../controllers/AddSkillUserController";
import { GetUserSkillsController } from "../controllers/GetUserSkillsController";

import ensureAuthenticated from "../../../shared/middlewares/ensureAuthenticated";
import ensureMentor from "../../../shared/middlewares/ensureMentor";

const userRoutes = Router()

const createUserController = new CreateUserController()
const addSkillUserController = new AddSkillUserController()
const getUserSkillsController = new GetUserSkillsController()

userRoutes.post("/", createUserController.handle)
userRoutes.post("/skills", ensureAuthenticated, ensureMentor, addSkillUserController.handle)
userRoutes.get("/skills/", ensureAuthenticated, ensureMentor, getUserSkillsController.handle)

export default userRoutes;