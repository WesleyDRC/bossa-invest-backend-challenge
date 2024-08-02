import { Request, Response } from "express";
import { container } from "tsyringe";

import { AddCalendarService } from "../services/AddCalendarService";
import { googleContants } from "../contants/googleContants";
import { AppError } from "../../../../../shared/errors/AppError";

export class AddCalendarController {
  public async handle(request: Request, response: Response) {
    const { userId, mentoringSessionId } = request.query;

    if (!mentoringSessionId) {
      throw new AppError(googleContants.USER_ID_REQUIRED, 400);
    }

    if (!userId) {
      throw new AppError(googleContants.MENTORING_SESSION_REQUIRED, 400);
    }

    const addCalendarService = container.resolve(AddCalendarService);

    const url = await addCalendarService.execute({
      userId,
      mentoringSessionId,
    });

    response.redirect(url);
  }
}
