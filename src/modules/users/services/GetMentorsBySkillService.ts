import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../repositories/IUserRepository";
import { IUser } from "../domain/IUser";

@injectable()
export class GetMentorsBySkillService {
	constructor(
		@inject("UserRepository")
		private userRepository: IUserRepository
	) { }

	async execute({ skill }): Promise<IUser[] | []> {
		const mentors = await this.userRepository.findMentorsBySkill(skill)

		mentors.forEach((mentor: IUser) => {
			delete mentor.password;
		});

		return mentors
	}
}