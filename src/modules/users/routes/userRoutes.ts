import { Router } from "express";

import { CreateUserController } from "../controllers/CreateUserController";
import { AddSkillUserController } from "../controllers/AddSkillUserController";
import { GetUserSkillsController } from "../controllers/GetUserSkillsController";
import { GetMentorsBySkillController } from "../controllers/GetMentorsBySkillController";

import ensureAuthenticated from "../../../shared/middlewares/ensureAuthenticated";
import ensureMentor from "../../../shared/middlewares/ensureMentor";

const userRoutes = Router();

const createUserController = new CreateUserController();
const addSkillUserController = new AddSkillUserController();
const getUserSkillsController = new GetUserSkillsController();
const getMentorsBySkillController = new GetMentorsBySkillController();

userRoutes.post("/", createUserController.handle);
userRoutes.post("/skills", ensureAuthenticated, ensureMentor, addSkillUserController.handle);
userRoutes.get("/skills/", ensureAuthenticated, ensureMentor, getUserSkillsController.handle);
userRoutes.get("/skills/mentors", ensureAuthenticated, getMentorsBySkillController.handle);

export default userRoutes;
