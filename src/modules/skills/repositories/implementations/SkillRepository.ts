import { Repository } from "typeorm";

import { ISkillRepository } from "../ISkillRepository";
import { ISkill } from "../../domain/ISkill";
import { IStoreSkillDto } from "../../dtos/IStoreSkillDTO";

import { Skill } from "../../entities/Skill";
import { AppDataSource } from "../../../../shared/typeorm";

export class SkillRepository implements ISkillRepository {

	private ormRepository: Repository<Skill>

	constructor() {
		this.ormRepository = AppDataSource.getRepository(Skill)
	}

	async create({name}: IStoreSkillDto): Promise<ISkill> {
		const skill = this.ormRepository.create({name})

		await this.ormRepository.save(skill)

		return {
			id: skill.id,
			name: skill.name
		}
	}

	async findByName(name: string): Promise<ISkill | null>{
		const skill = await this.ormRepository.findOneBy({name: name})

		return Promise.resolve(skill)
	}
}