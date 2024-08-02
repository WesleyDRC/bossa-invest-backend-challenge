import { Repository } from "typeorm";

import { IMentoringSessionRepository } from "../IMentoringSessionRepository";
import { IMentoringSession } from "../../domain/IMentoringSession";
import { IStoreMentoringSessionDto } from "../../dtos/IStoreMentoringSessionDto";

import { MentoringSession } from "../../entities/MentoringSession";
import { AppDataSource } from "../../../../shared/typeorm";

export class MentoringSessionRepository implements IMentoringSessionRepository {
  private ormRepository: Repository<MentoringSession>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(MentoringSession);
  }

  async create({
    mentor,
    mentee,
    skills,
    hourStart,
    hourEnd,
    scheduledAt,
  }: IStoreMentoringSessionDto): Promise<IMentoringSession> {
    const mentoringSession = this.ormRepository.create({
      mentor,
      mentee,
      skills,
      hourStart,
      hourEnd,
      scheduledAt,
    });

    await this.ormRepository.save(mentoringSession);

    return {
      id: mentoringSession.id,
      mentorId: mentoringSession.mentor.id,
      menteeId: mentoringSession.mentee.id,
      hourStart: mentoringSession.hourStart,
      hourEnd: mentoringSession.hourEnd,
      skills: mentoringSession.skills,
      status: mentoringSession.status,
      scheduledAt: mentoringSession.scheduledAt,
    };
  }

  async findMentoringSessionByHour({ mentorId, startAt, endAt }): Promise<IMentoringSession> {
    const mentoringSession = await this.ormRepository
      .createQueryBuilder("mentoring_session")
      .leftJoinAndSelect("mentoring_session.mentor", "mentor")
      .leftJoinAndSelect("mentoring_session.mentee", "mentee")
      .leftJoinAndSelect("mentoring_session.skills", "skills")
      .where("mentor.id = :id", { id: mentorId })
      .andWhere(":startAt <= mentoring_session.hourEnd AND :endAt >= mentoring_session.hourStart", {
        startAt,
        endAt,
      })
      .getOne();

    if (!mentoringSession) {
      return null;
    }

    return {
      id: mentoringSession.id,
      mentorId: mentoringSession.mentor.id,
      menteeId: mentoringSession.mentee.id,
      hourStart: mentoringSession.hourStart,
      hourEnd: mentoringSession.hourEnd,
      skills: mentoringSession.skills,
      status: mentoringSession.status,
      scheduledAt: mentoringSession.scheduledAt,
    };
  }

  async findById(id: string): Promise<IMentoringSession> {
    const mentoringSession = await this.ormRepository
      .createQueryBuilder("mentoring_session")
      .leftJoinAndSelect("mentoring_session.mentee", "mentee")
      .leftJoinAndSelect("mentoring_session.mentor", "mentor")
      .leftJoinAndSelect("mentoring_session.skills", "skills")
      .where("mentoring_session.id = :id", { id })
      .getOne();

    if (!mentoringSession) return null;

    return {
      id: mentoringSession.id,
      mentorId: mentoringSession.mentor.id,
      menteeId: mentoringSession.mentee.id,
      hourStart: mentoringSession.hourStart,
      hourEnd: mentoringSession.hourEnd,
      skills: mentoringSession.skills,
      status: mentoringSession.status,
      scheduledAt: mentoringSession.scheduledAt,
    };
  }

  async findUserMentoringSessions(userId: string): Promise<IMentoringSession[]> {
    const mentoringSessionsFound = await this.ormRepository
      .createQueryBuilder("mentoring_session")
      .leftJoinAndSelect("mentoring_session.mentee", "mentee")
      .leftJoinAndSelect("mentoring_session.mentor", "mentor")
      .leftJoinAndSelect("mentoring_session.skills", "skills")
      .where("(mentoring_session.mentee.id = :id OR mentoring_session.mentor.id = :id)", {
        id: userId,
      })
      .getMany();

    const mentoringSessions = mentoringSessionsFound.map((mentoringSession) => {
      return {
        id: mentoringSession.id,
        mentorId: mentoringSession.mentor.id,
        menteeId: mentoringSession.mentee.id,
        hourStart: mentoringSession.hourStart,
        hourEnd: mentoringSession.hourEnd,
        skills: mentoringSession.skills,
        status: mentoringSession.status,
        scheduledAt: mentoringSession.scheduledAt,
      };
    });

    return mentoringSessions;
  }

  async updateMentoringStatus({ sessionId, mentorId, status }): Promise<IMentoringSession> {
    await this.ormRepository
      .createQueryBuilder()
      .update(MentoringSession)
      .set({ status })
      .where("id = :id", { id: sessionId })
      .execute();

    const mentoringSession = await this.ormRepository
    .createQueryBuilder("mentoring_session")
    .leftJoinAndSelect("mentoring_session.mentee", "mentee")
    .leftJoinAndSelect("mentoring_session.mentor", "mentor")
    .leftJoinAndSelect("mentoring_session.skills", "skills")
    .where("mentoring_session.id = :id", { id: sessionId })
    .andWhere("mentor.id = :mentorId", { mentorId })
    .getOne();

    return {
      id: mentoringSession.id,
      mentorId: mentoringSession.mentor.id,
      menteeId: mentoringSession.mentee.id,
      hourStart: mentoringSession.hourStart,
      hourEnd: mentoringSession.hourEnd,
      skills: mentoringSession.skills,
      status: mentoringSession.status,
      scheduledAt: mentoringSession.scheduledAt,
    };
  }
}
