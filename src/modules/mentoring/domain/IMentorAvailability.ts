export interface IMentorAvailability {
	id: string,
	mentorId: string,
	hourStart: string,
	hourEnd: string
	availableDay: Date
	isAvailable: boolean
}