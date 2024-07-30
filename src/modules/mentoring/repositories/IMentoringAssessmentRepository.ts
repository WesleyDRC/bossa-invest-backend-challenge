import { IMentoringAssessment } from "../domain/IMentoringAssessment"
import { IStoreMentoringAssessmentDto } from "../dtos/IStoreMentoringAssessmentDto"

export interface IMentoringAssessmentRepository {
	create(assesment: IStoreMentoringAssessmentDto): Promise<IMentoringAssessment>
	findBySessionId(sessionId: string): Promise<IMentoringAssessment | null>
}