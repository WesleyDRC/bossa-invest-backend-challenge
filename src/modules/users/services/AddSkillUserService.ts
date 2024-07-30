import { inject, injectable } from "tsyringe"

import { IAddSkillUserDto } from "../dtos/IAddSkillUserDto";
import { ISkillRepository } from "../../skills/repositories/ISkillRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUser } from "../domain/IUser";

import { AppError } from "../../../shared/errors/AppError";
import { skillsConstants } from "../../skills/constants/skillsConstants";
import { userConstants } from "../constants/userConstants";
import { Skill } from "../../skills/entities/Skill";

@injectable()
export class AddSkillUserService {
	constructor(
		@inject("UserRepository")
		private userRepository: IUserRepository,

		@inject("SkillRepository")
		private skillRepository: ISkillRepository
	) { }

	async execute({
		userId,
		skillName
	}: IAddSkillUserDto): Promise<IUser> {

		const foundUser = await this.userRepository.findById(userId)

		if (!foundUser) {
			throw new AppError(userConstants.NOT_FOUND, 401)
		}

		const skill = await this.skillRepository.findByName(skillName)

		if (!skill) {
			throw new AppError(skillsConstants.NOT_FOUND, 401)
		}

		const skillExists = foundUser.skills.some((existingSkill: Skill) => existingSkill.id === skill.id);

		if (skillExists) {
			throw new AppError(userConstants.ALREADY_SKILL, 409)
		}

		const user = await this.userRepository.addSkillUser({ userId, skill })

		return user
	}
}