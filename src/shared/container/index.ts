import { container } from "tsyringe";

import "./providers"

import { IUserRepository } from "../../modules/users/repositories/IUserRepository";
import { UserRepository } from "../../modules/users/repositories/implementations/UserRepository";

import { ISkillRepository } from "../../modules/skills/repositories/ISkillRepository";
import { SkillRepository } from "../../modules/skills/repositories/implementations/SkillRepository";

import { IMentoringSessionRepository } from "../../modules/mentoring/repositories/IMentoringSessionRepository";
import { MentoringSessionRepository } from "../../modules/mentoring/repositories/implementations/MentoringSessionRepository";

import { IMentorAvailabilityRepository } from "../../modules/mentoring/repositories/IMentorAvailabilityRepository";
import { MentorAvailabilityRepository } from "../../modules/mentoring/repositories/implementations/MentorAvailabilityRepository";

import { IMentoringAssessmentRepository } from "../../modules/mentoring/repositories/IMentoringAssessmentRepository";
import { MentoringAssessmentRepository } from "../../modules/mentoring/repositories/implementations/MentoringAssessmentRepository";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository)
container.registerSingleton<ISkillRepository>("SkillRepository", SkillRepository)
container.registerSingleton<IMentoringSessionRepository>("MentoringSessionRepository", MentoringSessionRepository)
container.registerSingleton<IMentorAvailabilityRepository>("MentorAvailabilityRepository", MentorAvailabilityRepository)
container.registerSingleton<IMentoringAssessmentRepository>("MentoringAssessmentRepository", MentoringAssessmentRepository)