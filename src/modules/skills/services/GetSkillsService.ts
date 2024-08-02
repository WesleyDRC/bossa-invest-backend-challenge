import { inject, injectable } from "tsyringe";

import { ISkill } from "../domain/ISkill";
import { ISkillRepository } from "../repositories/ISkillRepository";

@injectable()
export class GetSkillsService {
  constructor(
    @inject("SkillRepository")
    private skillRepository: ISkillRepository
  ) {}

  async execute(): Promise<ISkill[] | []> {
    const skills = await this.skillRepository.findAll();

    return skills;
  }
}
