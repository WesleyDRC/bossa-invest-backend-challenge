import { IUser } from "../../users/domain/IUser";

export interface IStoreMentorAvailabilityDto {
	mentor: IUser,
	hourStart: number,
	hourEnd: number,
	availableDay: Date
}
