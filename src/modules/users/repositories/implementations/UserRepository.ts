import { Repository } from "typeorm";

import { IUser } from "../../domain/IUser";
import { IStoreUserDto } from "../../dtos/IStoreUserDto";
import { IUserRepository } from "../IUserRepository";
import { ISkill } from "../../../skills/domain/ISkill";

import { User } from "../../entities/User";
import { AppDataSource } from "../../../../shared/typeorm";

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  async create({ name, email, password, role }: IStoreUserDto): Promise<IUser> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      role,
    });

    await this.ormRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      email,
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.ormRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.skills", "skill")
      .where("user.id = :id", {
        id: id,
      })
      .getOne();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      skills: user.skills,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async addSkillUser({ userId, skill }) {
    const user = await this.ormRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.skills", "skill")
      .where("user.id = :id", {
        id: userId,
      })
      .getOne();

    user.skills.push(skill);

    await this.ormRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      skills: user.skills,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async getUserSkills(userId: string): Promise<ISkill[] | []> {
    const user = await this.ormRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.skills", "skill")
      .where("user.id = :id", {
        id: userId,
      })
      .getOne();

    const skills = user.skills;

    return skills;
  }

  async findMentorsBySkill(skill: string): Promise<IUser[] | []> {
    const mentors = await this.ormRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.skills", "skill")
      .where("skill.name = :skill", {
        skill,
      })
      .andWhere("user.role = :role", {
        role: "mentor",
      })
      .getMany();

    return mentors;
  }
}
