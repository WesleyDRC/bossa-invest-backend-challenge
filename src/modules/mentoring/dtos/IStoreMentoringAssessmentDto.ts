import { IUser } from "../../users/domain/IUser"
import { IMentoringSession } from "../domain/IMentoringSession"

export interface IStoreMentoringAssessmentDto {
	mentee: IUser,
	session: IMentoringSession,
	grade: number,
	comment: string
}