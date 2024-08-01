import { IMentoringSession } from "../domain/IMentoringSession";
import { IStoreMentoringSessionDto } from "../dtos/IStoreMentoringSessionDto";

export interface IMentoringSessionRepository {
	create(mentoringSession: IStoreMentoringSessionDto): Promise<IMentoringSession>
	findMentoringSessionByHour({ mentorId, startAt, endAt }): Promise<IMentoringSession> 
	findById(id: string): Promise<IMentoringSession>
}