import { ISkill } from "../domain/ISkill";
import { IStoreSkillDto } from "../dtos/IStoreSkillDTO";

export interface ISkillRepository {
  create(skill: IStoreSkillDto): Promise<ISkill>;
  findByName(name: string): Promise<ISkill | null>;
  findAll(): Promise<ISkill[] | []>;
}
