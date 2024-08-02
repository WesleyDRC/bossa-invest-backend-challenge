import { IMentoringSession } from "../domain/IMentoringSession";
import { IStoreMentoringSessionDto } from "../dtos/IStoreMentoringSessionDto";

export interface IMentoringSessionRepository {
  create(mentoringSession: IStoreMentoringSessionDto): Promise<IMentoringSession>;
  findMentoringSessionByHour({ mentorId, startAt, endAt }): Promise<IMentoringSession | null>;
  findById(id: string): Promise<IMentoringSession>;
  findUserMentoringSessions(userId: string): Promise<IMentoringSession[]>;
}
