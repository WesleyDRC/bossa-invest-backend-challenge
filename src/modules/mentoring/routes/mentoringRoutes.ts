import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateMentoringSessionController } from "../controllers/CreateMentoringSessionController";
import { CreateMentorAvailabilityController } from "../controllers/CreateMentorAvailabilityController";
import { CreateMentoringAssessmentController } from "../controllers/CreateMentoringAssessmentController";

import ensureAuthenticated from "../../../share\d/middlewares/ensureAuthenticated";
import ensureMentor from "../../../shared/middlewares/ensureMentor";
import ensureMentee from "../../../shared/middlewares/ensureMentee";

const mentoringRoutes = Router()

const createMentoringSessionController = new CreateMentoringSessionController()
const createMentorAvailabilityController = new CreateMentorAvailabilityController()
const createMentoringAssessmentController = new CreateMentoringAssessmentController()

const createMentoringSessionSchema = Joi.object({
	mentorId: Joi.string().required(),
	skills: Joi.array().items(Joi.string()).required(),
	hourStart: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
		"string.pattern.base": "A hora deve seguir o padrão 00:00."
	}),
	hourEnd: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
		"string.pattern.base": "A hora deve seguir o padrão 00:00."
	}),
	scheduledAt: Joi.string().regex(/^\d{2}-\d{2}-\d{4}$/).required().messages({
		"string.pattern.base": "A data deve seguir o padrão DD-MM-YYYY"
	})
})

mentoringRoutes.post(
	"/",
	ensureAuthenticated,
	ensureMentee,
	celebrate({
		[Segments.BODY]: createMentoringSessionSchema
	}),
	createMentoringSessionController.handle
)

mentoringRoutes.post("/availability", ensureAuthenticated, ensureMentor, createMentorAvailabilityController.handle)
mentoringRoutes.post("/assessment", ensureAuthenticated, ensureMentee, createMentoringAssessmentController.handle)

export default mentoringRoutes
