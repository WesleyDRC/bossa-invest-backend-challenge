enum MentoringStatus {
	SCHEDULED = "scheduled",
	COMPLETED = "completed",
	CANCELED = "canceled",
}

export interface IMentoringSession {
	id: string,
	mentorId: string,
	menteeId: string,
	hourStart: number,
	hourEnd: number,
	skills: any,
	status: MentoringStatus;
	scheduledAt: Date
}