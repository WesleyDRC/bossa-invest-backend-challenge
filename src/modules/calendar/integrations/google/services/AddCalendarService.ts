import { inject, injectable } from "tsyringe";
import { google } from "googleapis";

import { IUserRepository } from "../../../../users/repositories/IUserRepository";
import { IMentoringSessionRepository } from "../../../../mentoring/repositories/IMentoringSessionRepository";

import { AppError } from "../../../../../shared/errors/AppError";

import { userConstants } from "../../../../users/constants/userConstants";
import { mentoringConstants } from "../../../../mentoring/contants/mentoringContants";
import { googleContants } from "../contants/googleContants";

@injectable()
export class AddCalendarService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,

    @inject("MentoringSessionRepository")
    private mentoringSessionRepository: IMentoringSessionRepository
  ) {}
  async execute({ userId, mentoringSessionId }): Promise<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(userConstants.NOT_FOUND, 404);
    }

    if (user.role.toLowerCase() !== "mentee") {
      throw new AppError(googleContants.MENTOR_NOT_PERMITTED_CONTINUE, 403);
    }

    const mentoringSession = await this.mentoringSessionRepository.findById(mentoringSessionId);

    if (!mentoringSession) {
      throw new AppError(mentoringConstants.SESSION_NOT_FOUND, 404);
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: mentoringSessionId as string,
    });

    return url;
  }
}
