//import { Skill } from "../../skills/entities/Skill";
import { ISkill } from "../../skills/domain/ISkill";

enum UserType {
  MENTOR = "mentor",
  MENTEE = "mentee",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserType;
  skills?: ISkill[] | [];
  created_at: Date;
  updated_at: Date;
}
