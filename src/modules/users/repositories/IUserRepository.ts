import { IStoreUserDto } from "../dtos/IStoreUserDto";
import { IUser } from "../domain/IUser";
import { ISkill } from "../../skills/domain/ISkill";

export interface IUserRepository {
  create(user: IStoreUserDto): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  addSkillUser({
    userId,
    skill,
  }: {
    userId: string;
    skill: ISkill;
  }): Promise<IUser>;
  getUserSkills(userId: string): Promise<ISkill[] | []>;
  findMentorsBySkill(skill: string): Promise<IUser[] | []>;
}
