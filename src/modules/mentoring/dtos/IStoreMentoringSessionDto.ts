import { ISkill } from "../../skills/domain/ISkill";
import { IUser } from "../../users/domain/IUser";

export interface IStoreMentoringSessionDto {
	mentor: IUser,
	mentee: IUser,
	skills: ISkill[] | [],
	hourStart: number,
	hourEnd: number,
	scheduledAt: Date
}