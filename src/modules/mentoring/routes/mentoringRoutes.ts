import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateMentoringSessionController } from "../controllers/CreateMentoringSessionController";
import { CreateMentorAvailabilityController } from "../controllers/CreateMentorAvailabilityController";
import { CreateMentoringAssessmentController } from "../controllers/CreateMentoringAssessmentController";
import { GetAvailableMentoringBySkillController } from "../controllers/GetAvailableMentoringBySkillController";
import { GetUserMentoringSessionsController } from "../controllers/GetUserMentoringSessionsController";
import { UpdateMentoringStatusController } from "../controllers/UpdateMentoringStatusController";

import ensureAuthenticated from "../../../shared/middlewares/ensureAuthenticated";
import ensureMentor from "../../../shared/middlewares/ensureMentor";
import ensureMentee from "../../../shared/middlewares/ensureMentee";

const mentoringRoutes = Router();

const createMentoringSessionController = new CreateMentoringSessionController();
const createMentorAvailabilityController = new CreateMentorAvailabilityController();
const createMentoringAssessmentController = new CreateMentoringAssessmentController();
const getAvailableMentoringBySkillController = new GetAvailableMentoringBySkillController();
const getUserMentoringSessionsController = new GetUserMentoringSessionsController();
const updateMentoringStatusController = new UpdateMentoringStatusController();

const createMentoringSessionBodySchema = Joi.object({
  mentorId: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).required(),
  hourStart: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "A hora deve seguir o padrão 00:00.",
    }),
  hourEnd: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "A hora deve seguir o padrão 00:00.",
    }),
  scheduledAt: Joi.string()
    .regex(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "A data deve seguir o padrão DD-MM-YYYY",
    }),
});

const updateMentoringSessionBodySchema = Joi.object({
  status: Joi.string().required().valid("scheduled", "completed", "canceled").messages({
    "string.empty": "O status da sessão não pode estar vazio.",
    "any.required": "O status da sessão é obrigatório.",
    "any.only": "O status deve ser um dos seguintes valores: scheduled, completed, canceled.",
  }),
});

const updateMentoringSessionParamsSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    "string.empty": "O ID da sessão não pode estar vazio.",
    "any.required": "O ID da sessão é obrigatório.",
  }),
});

const createMentoringAssessmentBodySchema = Joi.object({
  grade: Joi.number().integer().required().messages({
    "number.integer": "Grade deve ser um número inteiro.",
    "any.required": "O campo nota da mentoria é obrigatório.",
  }),
  comment: Joi.string().required().messages({
    "string.empty": "Escreva um comentário sobre a mentoria.",
    "any.required": "O comment é obrigatório.",
  }),
  sessionId: Joi.string().required().messages({
    "string.empty": "O ID da sessão não pode estar vazio.",
    "any.required": "O ID da sessão é obrigatório.",
  })
});

mentoringRoutes.post(
  "/",
  ensureAuthenticated,
  ensureMentee,
  celebrate({
    [Segments.BODY]: createMentoringSessionBodySchema,
  }),
  createMentoringSessionController.handle
);

mentoringRoutes.post(
  "/availability",
  ensureAuthenticated,
  ensureMentor,
  createMentorAvailabilityController.handle
);
mentoringRoutes.post(
  "/assessment",
  ensureAuthenticated,
  ensureMentee,
  celebrate({
    [Segments.BODY]: createMentoringAssessmentBodySchema,
  }),
  createMentoringAssessmentController.handle
);
mentoringRoutes.get(
  "/available/",
  ensureAuthenticated,
  getAvailableMentoringBySkillController.handle
);

mentoringRoutes.get("/user/", ensureAuthenticated, getUserMentoringSessionsController.handle);

mentoringRoutes.patch(
  "/:sessionId",
  ensureAuthenticated,
  ensureMentor,
  celebrate({
    [Segments.PARAMS]: updateMentoringSessionParamsSchema,
    [Segments.BODY]: updateMentoringSessionBodySchema,
  }),
  updateMentoringStatusController.handle
);

export default mentoringRoutes;
