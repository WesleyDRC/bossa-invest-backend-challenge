import { inject, injectable } from "tsyringe";

import { IMentoringAssessmentRepository } from "../repositories/IMentoringAssessmentRepository";
import { IUserRepository } from "../../users/repositories/IUserRepository";
import { IMentoringSessionRepository } from "../repositories/IMentoringSessionRepository";
import { IMentoringSession } from "../domain/IMentoringSession";

import { userConstants } from "../../users/constants/userConstants";
import { AppError } from "../../../shared/errors/AppError";
import { mentoringConstants } from "../contants/mentoringContants";

enum MentoringStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

@injectable()
export class CreateMentoringAssessmentService {
  constructor(
    @inject("MentoringAssessmentRepository")
    private mentoringAssessmentRepository: IMentoringAssessmentRepository,

    @inject("MentoringSessionRepository")
    private mentoringSessionRepository: IMentoringSessionRepository,

    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({ grade, comment, menteeId, sessionId }) {
    const foundMentee = await this.userRepository.findById(menteeId);

    if (!foundMentee) {
      throw new AppError(userConstants.NOT_FOUND, 404);
    }

    const foundMentoringSession = await this.mentoringSessionRepository.findById(sessionId);

    if (!foundMentoringSession) {
      throw new AppError(mentoringConstants.SESSION_NOT_FOUND, 404);
    }

    const mentoringIsOver = this.mentoringIsOver(foundMentoringSession);

    if (!mentoringIsOver) {
      throw new AppError(mentoringConstants.SESSION_IS_NOT_OVER, 403);
    }

    const alreadyExistsAssessment = await this.mentoringAssessmentRepository.findBySessionId(
      sessionId
    );

    if (alreadyExistsAssessment) {
      throw new AppError(mentoringConstants.ALREADY_EXISTS_ASSESSMENT, 409);
    }

    const userParticipatedMentoring = this.userParticipatedMentoring(
      menteeId,
      foundMentoringSession
    );

    if (!userParticipatedMentoring) {
      throw new AppError(mentoringConstants.MENTEE_NOT_PARTICIPATE_MENTORING, 404);
    }

    const mentorAssesment = await this.mentoringAssessmentRepository.create({
      grade,
      comment,
      mentee: foundMentee,
      session: foundMentoringSession,
    });

    return mentorAssesment;
  }

  private mentoringIsOver(mentoringSession: IMentoringSession): boolean {
    if (mentoringSession.status.toLocaleLowerCase() !== MentoringStatus.COMPLETED) {
      return false;
    }

    return true;
  }

  private userParticipatedMentoring(
    menteeId: string,
    mentoringSession: IMentoringSession
  ): boolean {
    if (menteeId !== mentoringSession.menteeId) {
      return false;
    }

    return true;
  }
}
