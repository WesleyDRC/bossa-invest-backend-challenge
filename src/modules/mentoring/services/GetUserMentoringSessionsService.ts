import { inject, injectable } from "tsyringe";

import { IMentoringSessionRepository } from "../repositories/IMentoringSessionRepository";
import { IMentoringSession } from "../domain/IMentoringSession";

@injectable()
export class GetUserMentoringSessionsService {
  constructor(
    @inject("MentoringSessionRepository")
    private mentoringSessionRepository: IMentoringSessionRepository
  ) {}

  async execute({ userId }): Promise<IMentoringSession[]> {
    const mentoringSessions = await this.mentoringSessionRepository.findUserMentoringSessions(
      userId
    );

    return mentoringSessions;
  }
}
