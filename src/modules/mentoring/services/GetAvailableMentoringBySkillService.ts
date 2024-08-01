import { inject, injectable } from "tsyringe"

import { IMentorAvailabilityRepository } from "../repositories/IMentorAvailabilityRepository";
import { IMentorAvailability } from "../domain/IMentorAvailability";

@injectable()
export class GetAvailableMentoringBySkillService {

	constructor(
		@inject("MentorAvailabilityRepository")
		private mentorAvailabilityRepository: IMentorAvailabilityRepository,

	) { }

	async execute({ skill }): Promise<IMentorAvailability[]> {
		const mentoringAvailable = await this.mentorAvailabilityRepository.getAvailableMentorsBySkill(skill)

		return mentoringAvailable
	}
}
