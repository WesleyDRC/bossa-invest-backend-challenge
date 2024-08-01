import { inject, injectable } from "tsyringe"

import { IMentorAvailabilityRepository } from "../repositories/IMentorAvailabilityRepository";
import { IMentorAvailability } from "../domain/IMentorAvailability";

import { AppError } from "../../../shared/errors/AppError";
import { mentoringConstants } from "../contants/mentoringContants";

@injectable()
export class GetAvailableMentoringBySkillService {

	constructor(
		@inject("MentorAvailabilityRepository")
		private mentorAvailabilityRepository: IMentorAvailabilityRepository,

	) { }

	async execute({ skill }): Promise<IMentorAvailability[]> {
		const mentoringAvailable = await this.mentorAvailabilityRepository.findAvailableMentoringBySkill(skill)

		return mentoringAvailable
	}
}
