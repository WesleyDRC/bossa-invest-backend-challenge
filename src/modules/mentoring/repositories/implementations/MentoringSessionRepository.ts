import { Repository } from "typeorm";

import { IMentoringSessionRepository } from "../IMentoringSessionRepository";
import { IMentoringSession } from "../../domain/IMentoringSession";
import { IStoreMentoringSessionDto } from "../../dtos/IStoreMentoringSessionDto";

import { MentoringSession } from "../../entities/MentoringSession";
import { AppDataSource } from "../../../../shared/typeorm";
import { convertMinutesToHourString } from "../../../../shared/utils/convert-minutes-to-hour-string";

export class MentoringSessionRepository implements IMentoringSessionRepository {

	private ormRepository: Repository<MentoringSession>

	constructor() {
		this.ormRepository = AppDataSource.getRepository(MentoringSession)
	}

	async create({
		mentor,
		mentee,
		skills,
		hourStart,
		hourEnd,
		scheduledAt
	}: IStoreMentoringSessionDto): Promise<IMentoringSession> {

		const mentoringSession = this.ormRepository.create({
			mentor,
			mentee,
			skills,
			hourStart,
			hourEnd,
			scheduledAt
		})

		await this.ormRepository.save(mentoringSession)

		return {
			id: mentoringSession.id,
			mentorId: mentoringSession.mentor.id,
			menteeId: mentoringSession.mentee.id,
			hourStart: mentoringSession.hourStart,
			hourEnd: mentoringSession.hourEnd,
			skills: mentoringSession.skills,
			status: mentoringSession.status,
			scheduledAt: mentoringSession.scheduledAt
		}
	}

	async findMentoringSessionByHour({ mentorId, startAt, endAt }) {

		const mentoringSession = await this.ormRepository
			.createQueryBuilder('mentoring_session')
			.leftJoinAndSelect('mentoring_session.mentor', 'user')
			.where('user.id = :id', { id: mentorId })
			.andWhere(':startAt <= mentoring_session.hourEnd AND :endAt >= mentoring_session.hourStart', { startAt, endAt })
			.getOne();

		return mentoringSession
	}

	async findById(id: string): Promise<IMentoringSession> {
		const mentoringSession = await this.ormRepository
			.createQueryBuilder('mentoring_session')
			.leftJoinAndSelect('mentoring_session.mentee', 'mentee')
			.leftJoinAndSelect('mentoring_session.mentor', 'menttor')
			.leftJoinAndSelect('mentoring_session.skills', 'skills')
			.where("mentoring_session.id = :id", { id })
			.getOne();

		if (!mentoringSession) return null

		return {
			id: mentoringSession.id,
			mentorId: mentoringSession.mentor.id,
			menteeId: mentoringSession.mentee.id,
			hourStart: mentoringSession.hourStart,
			hourEnd: mentoringSession.hourEnd,
			skills: mentoringSession.skills,
			status: mentoringSession.status,
			scheduledAt: mentoringSession.scheduledAt
		}
	}
}