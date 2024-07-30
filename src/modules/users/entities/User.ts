import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { v4 as uuidv4 } from "uuid"

import { Skill } from "../../skills/entities/Skill";
import { MentoringSession } from "../../mentoring/entities/MentoringSession";
import { MentorAvailability } from "../../mentoring/entities/MentorAvailability";
import { MentoringAssessment } from "../../mentoring/entities/MentoringAssessment";

enum UserType {
	MENTOR = "mentor",
	MENTEE = "mentee"
}

@Entity("user")
export class User {
	@PrimaryColumn({
		type: "varchar",
		length: 255
	})
	id: string

	@Column({
		type: "varchar",
		length: 255
	})
	name: string

	@Column({
		type: "varchar",
		length: 255
	})
	email: string

	@Column({
		type: "varchar",
		length: 255
	})
	password: string

	@Column({
		type: "enum",
		enum: UserType
	})
	role: UserType

	@CreateDateColumn({
		type: "timestamp"
	})
	created_at: Date;

	@UpdateDateColumn({
		type: "timestamp"
	})
	updated_at: Date;

	@ManyToMany(() => Skill, skill => skill.mentoringSessions)
	@JoinTable({
		name: "user_skill",
		joinColumn: {
			name: "user_id",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "skill_id",
			referencedColumnName: "id"
		}
	})
	skills: Skill[]

	@OneToMany(() => MentoringSession, session => session.mentor)
	mentoringSessionsMentor: MentoringSession[]

	@OneToMany(() => MentoringSession, session => session.mentee)
	mentoringSessionsMentee: MentoringSession[]

	@OneToMany(() => MentorAvailability, available => available.mentor)
	availabilities: MentorAvailability[]

	@OneToMany(() => MentoringAssessment, assessment => assessment.mentee)
	assessments: MentoringAssessment[]

	constructor() {
		if (!this.id) this.id = uuidv4()
	}
}