import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetUserMentoringSessionsService } from "../services/GetUserMentoringSessionsService";

export class GetUserMentoringSessionsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const getUserMentoringSessionsService = container.resolve(GetUserMentoringSessionsService);

    const mentoringSessions = await getUserMentoringSessionsService.execute({
      userId,
    });

    return response.json({ mentoringSessions });
  }
}
