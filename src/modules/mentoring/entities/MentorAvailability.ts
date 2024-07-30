import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid"

import { User } from "../../users/entities/User";

@Entity("mentor_availability")
export class MentorAvailability {
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
	availableDay: Date

	@Column({
    type: "boolean",
    default: true
  })
  isAvailable: boolean;

	@ManyToOne(() => User, user => user.availabilities)
	mentor: User

	constructor() {
		if (!this.id) this.id = uuidv4()
	}
}