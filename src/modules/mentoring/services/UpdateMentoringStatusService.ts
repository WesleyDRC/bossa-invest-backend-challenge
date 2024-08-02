import { inject, injectable } from "tsyringe";

import { IMentoringSessionRepository } from "../repositories/IMentoringSessionRepository";
import { IMentoringSession } from "../domain/IMentoringSession";

import { AppError } from "../../../shared/errors/AppError";

import { mentoringConstants } from "../contants/mentoringContants";

@injectable()
export class UpdateMentoringStatusService {
  constructor(
    @inject("MentoringSessionRepository")
    private mentoringSessionRepository: IMentoringSessionRepository
  ) {}
  async execute({ sessionId, mentorId, status }): Promise<IMentoringSession> {

    const foundMentoringSession = await this.mentoringSessionRepository.findById(sessionId);

    if (!foundMentoringSession) {
      throw new AppError(mentoringConstants.SESSION_NOT_FOUND, 404);
    }

    if(mentorId !== foundMentoringSession.mentorId) {
      throw new AppError(mentoringConstants.USER_NOT_PARTICIPATE_MENTORING, 403)
    }

    const mentoringSession = await this.mentoringSessionRepository.updateMentoringStatus({
      sessionId,
			mentorId,
      status,
    });

    return mentoringSession;
  }
}
