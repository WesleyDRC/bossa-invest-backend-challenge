import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid"

import { User } from "../../users/entities/User";
import { Skill } from "../../skills/entities/Skill";
import { MentoringAssessment } from "./MentoringAssessment";

enum MentoringStatus {
	SCHEDULED = "scheduled",
	COMPLETED = "completed",
	CANCELED = "canceled",
}

@Entity("mentoring_session")
export class MentoringSession {

	@PrimaryColumn({
		type: "varchar",
		length: 255
	})
	id: string

	@Column({
		type: "int"
	})
	hourStart: number

	@Column({
		type: "int"
	})
	hourEnd: number

	@Column({
		type: "date"
	})
	scheduledAt: Date

	@Column({
		type: "enum",
		enum: MentoringStatus,
		default: MentoringStatus.SCHEDULED
	})
	status: MentoringStatus

	@ManyToOne(() => User, user => user.mentoringSessionsMentee)
	@JoinColumn({ name: "mentee_id" })
	mentee: User

	@ManyToOne(() => User, user => user.mentoringSessionsMentor)
	@JoinColumn({ name: "mentor_id" })
	mentor: User

	@ManyToMany(() => Skill, skill => skill.mentoringSessions)
	@JoinTable({
		name: "session_skill",
		joinColumn: {
			name: "session_id",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "skill_id",
			referencedColumnName: "id"
		}
	})
	skills: Skill[]

	@OneToOne(() => MentoringAssessment, assessment => assessment.mentee)
	assessment: MentoringAssessment;

	constructor() {
		if (!this.id) this.id = uuidv4()
	}
}