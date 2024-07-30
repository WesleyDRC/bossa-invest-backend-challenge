import { Router } from "express";

import { CreateSkillController } from "../controllers/CreateSkillController";

const skillRoutes = Router()

const createSkillController = new CreateSkillController()

skillRoutes.post("/",  createSkillController.handle)

export default skillRoutes