import { Skill } from "../../skills/entities/Skill";

enum UserType {
	MENTOR = "mentor",
	MENTEE = "mentee"
}

export interface IUser {
	id: string,
	name: string,
	email: string,
	password: string,
	role: UserType,
	skills?: Skill[] | [],
	created_at: Date,
	updated_at: Date
}