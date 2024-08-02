import { IStoreMentorAvailabilityDto } from "../dtos/IStoreMentorAvailabilityDto";
import { IMentorAvailability } from "../domain/IMentorAvailability";

export interface IMentorAvailabilityRepository {
  create(mentoringSession: IStoreMentorAvailabilityDto): Promise<IMentorAvailability>;

  getAvailabilityByMentorId(mentorId: string): Promise<IMentorAvailability[] | []>;

  getAvailabilityByMentorIdAndDate({ mentorId, availableDay }): Promise<IMentorAvailability[]>;

  getAvailableMentorsBySkill(skill: string): Promise<IMentorAvailability[]>;
}
