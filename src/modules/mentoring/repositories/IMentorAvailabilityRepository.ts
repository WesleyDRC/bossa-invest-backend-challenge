import { IStoreMentorAvailabilityDto } from "../dtos/IStoreMentorAvailabilityDto"
import { IMentorAvailability } from "../domain/IMentorAvailability"

export interface IMentorAvailabilityRepository {
	create(mentoringSession: IStoreMentorAvailabilityDto): Promise<IMentorAvailability>
	findByMentorId(mentorId: string): Promise<IMentorAvailability[] | []>
	findByMentorIdAndDay({mentorId, availableDay }): Promise<IMentorAvailability[]>
	findAvailableMentoringBySkill(skill: string): Promise<IMentorAvailability[]>
}