import { IMentoringSession } from "../domain/IMentoringSession";
import { IStoreMentoringSessionDto } from "../dtos/IStoreMentoringSessionDto";

export interface IMentoringSessionRepository {
	create(mentoringSession: IStoreMentoringSessionDto): Promise<IMentoringSession>
	findMentoringSessionByHour({ mentorId, startAt, endAt })
	findById(id: string): Promise<IMentoringSession>
}