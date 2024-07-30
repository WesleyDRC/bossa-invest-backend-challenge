import { inject, injectable } from "tsyringe";

import { ISkill } from "../domain/ISkill";
import { IStoreSkillDto } from "../dtos/IStoreSkillDTO";
import { ISkillRepository } from "../repositories/ISkillRepository";
import { AppError } from "../../../shared/errors/AppError";
import { skillsConstants } from "../constants/skillsConstants";

@injectable()
export class CreateSkillService {
	constructor(
		@inject("SkillRepository")
		private skillRepository: ISkillRepository
	){}

	async execute({name}: IStoreSkillDto): Promise<ISkill> {
		const foundSkill = await this.skillRepository.findByName(name)

		if(foundSkill) {
			throw new AppError(skillsConstants.ALREADY_REGISTERED, 409)
		}

		const skill = await this.skillRepository.create({name})

		return skill
	}
}