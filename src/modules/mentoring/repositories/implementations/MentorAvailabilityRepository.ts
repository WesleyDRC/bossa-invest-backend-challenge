import { Repository } from "typeorm";

import { IMentorAvailability } from "../../domain/IMentorAvailability";
import { IStoreMentorAvailabilityDto } from "../../dtos/IStoreMentorAvailabilityDto";
import { IMentorAvailabilityRepository } from "../IMentorAvailabilityRepository";

import { MentorAvailability } from "../../entities/MentorAvailability";
import { AppDataSource } from "../../../../shared/typeorm";
import { convertMinutesToHourString } from "../../../../shared/utils/convert-minutes-to-hour-string";

export class MentorAvailabilityRepository implements IMentorAvailabilityRepository {

	private ormRepository: Repository<MentorAvailability>

	constructor() {
		this.ormRepository = AppDataSource.getRepository(MentorAvailability)
	}

	async create({
		mentor,
		hourStart,
		hourEnd,
		availableDay
	}: IStoreMentorAvailabilityDto): Promise<IMentorAvailability> {

		const mentorAvailability = this.ormRepository.create({
			mentor,
			hourStart,
			hourEnd,
			availableDay
		})

		await this.ormRepository.save(mentorAvailability)

		return {
			id: mentorAvailability.id,
			mentorId: mentorAvailability.mentor.id,
			hourStart: convertMinutesToHourString(mentorAvailability.hourStart),
			hourEnd: convertMinutesToHourString(mentorAvailability.hourEnd),
			availableDay: mentorAvailability.availableDay,
			isAvailable: mentorAvailability.isAvailable
		}
	}

	async findByMentorId(mentorId: string): Promise<IMentorAvailability[] | []> {
		const mentorAvailabilityFound = await this.ormRepository.createQueryBuilder('mentor_availability')
			.leftJoinAndSelect('mentor_availability.mentor', 'user')
			.where('user.id = :id', { id: mentorId })
			.getMany();

		const mentorAvailability = mentorAvailabilityFound.map((availability) => {
			return {
				id: availability.id,
				mentorId: availability.mentor.id,
				hourStart: convertMinutesToHourString(availability.hourStart),
				hourEnd: convertMinutesToHourString(availability.hourEnd),
				availableDay: availability.availableDay,
				isAvailable: availability.isAvailable
			}
		})

		return mentorAvailability
	}

	async findByMentorIdAndDay({mentorId, availableDay }): Promise<IMentorAvailability[]> {
		const availabilitiesFound = await this.ormRepository
			.createQueryBuilder('mentor_availability')
			.leftJoinAndSelect('mentor_availability.mentor', 'user')
			.where('user.id = :id', { id: mentorId })
			.andWhere('mentor_availability.availableDay = :availableDay', { availableDay })
			.getMany();

		const availabilities = availabilitiesFound.map((availability) => {
			return {
				id: availability.id,
				mentorId: availability.mentor.id,
				hourStart: convertMinutesToHourString(availability.hourStart),
				hourEnd: convertMinutesToHourString(availability.hourEnd),
				availableDay: availability.availableDay,
				isAvailable: availability.isAvailable
			}
		})

		return availabilities
	}
}
