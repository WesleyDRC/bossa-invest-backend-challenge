import { Entity, PrimaryColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../users/entities/User";
import { MentoringSession } from "./MentoringSession";

@Entity("mentoring_assessment")
export class MentoringAssessment {
  @PrimaryColumn({
    type: "varchar",
    length: 255,
  })
  id: string;

  @Column({
    type: "int",
  })
  grade: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  comment: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @OneToOne(() => MentoringSession, (session) => session.assessment)
  @JoinColumn({ name: "session_id" })
  session: MentoringSession;

  @ManyToOne(() => User, (user) => user.mentoringSessionsMentor)
  @JoinColumn({ name: "mentee_id" })
  mentee: User;

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
