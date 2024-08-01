import { Router } from "express";

import { CreateSkillController } from "../controllers/CreateSkillController";
import { GetSkillsController } from "../controllers/GetSkillsController";

const skillRoutes = Router()

const createSkillController = new CreateSkillController()
const getSkillsController = new GetSkillsController()

skillRoutes.post("/",  createSkillController.handle)
skillRoutes.get("/",  getSkillsController.handle)

export default skillRoutes