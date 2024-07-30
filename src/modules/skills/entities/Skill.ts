import { Entity, PrimaryColumn, Column, ManyToMany} from "typeorm";
import {v4 as uuidv4} from "uuid"

import { User } from "../../users/entities/User";
import { MentoringSession } from "../../mentoring/entities/MentoringSession";

@Entity("skill")
export class Skill {

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

	@ManyToMany(() => User, user => user.skills)
	users: User[]
	
	@ManyToMany(() => MentoringSession, session => session.skills)
	mentoringSessions: MentoringSession[]

	constructor() {
		if(!this.id) this.id = uuidv4()
	}

}