enum UserType {
	MENTOR = "mentor",
	MENTEE = "mentee"
}

export interface IStoreUserDto {
	name: string,
	email: string,
	password: string,
	confirmPassword?: string,
	role: UserType,
}