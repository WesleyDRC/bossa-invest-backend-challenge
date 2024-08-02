import { Repository } from "typeorm";

import { IMentoringAssessmentRepository } from "../IMentoringAssessmentRepository";
import { IStoreMentoringAssessmentDto } from "../../dtos/IStoreMentoringAssessmentDto";
import { IMentoringAssessment } from "../../domain/IMentoringAssessment";

import { MentoringAssessment } from "../../entities/MentoringAssessment";
import { AppDataSource } from "../../../../shared/typeorm";

export class MentoringAssessmentRepository implements IMentoringAssessmentRepository {
  private ormRepository: Repository<MentoringAssessment>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(MentoringAssessment);
  }

  async create({
    mentee,
    session,
    grade,
    comment,
  }: IStoreMentoringAssessmentDto): Promise<IMentoringAssessment> {
    const mentoringAssessment = this.ormRepository.create({
      mentee,
      session,
      grade,
      comment,
    });

    await this.ormRepository.save(mentoringAssessment);

    return {
      id: mentoringAssessment.id,
      grade: mentoringAssessment.grade,
      comment: mentoringAssessment.comment,
      menteeId: mentee.id,
      sessionId: session.id,
    };
  }

  async findBySessionId(sessionId: string): Promise<IMentoringAssessment> {
    const mentoringAssessment = await this.ormRepository
      .createQueryBuilder("mentoring_assessment")
      .leftJoinAndSelect("mentoring_assessment.session", "session")
      .leftJoinAndSelect("mentoring_assessment.mentee", "mentee")
      .where("mentoring_assessment.session.id = :id", { id: sessionId })
      .getOne();

    if (!mentoringAssessment) return null;

    return {
      id: mentoringAssessment.id,
      grade: mentoringAssessment.grade,
      comment: mentoringAssessment.comment,
      menteeId: mentoringAssessment.mentee.id,
      sessionId: mentoringAssessment.session.id,
    };
  }
}
