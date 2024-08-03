enum MentoringStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface IMentoringSession {
  id: string;
  mentorId: string;
  menteeId: string;
  hourStart: number | string;
  hourEnd: number | string;
  skills: any;
  status: MentoringStatus;
  scheduledAt: string;
}
