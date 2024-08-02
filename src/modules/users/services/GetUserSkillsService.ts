import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../repositories/IUserRepository";
import { ISkill } from "../../skills/domain/ISkill";

@injectable()
export class GetUserSkillsService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({ userId }): Promise<ISkill[] | []> {
    const skills = await this.userRepository.getUserSkills(userId);

    return skills;
  }
}
