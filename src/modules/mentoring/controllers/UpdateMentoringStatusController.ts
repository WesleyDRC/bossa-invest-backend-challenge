import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateMentoringStatusService } from "../services/UpdateMentoringStatusService";

export class UpdateMentoringStatusController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const mentorId = request.user.id;

    const { sessionId } = request.params;

    const { status } = request.body;

    const updateMentoringStatusService = container.resolve(UpdateMentoringStatusService);

    const mentoringSession = await updateMentoringStatusService.execute({
      sessionId,
			mentorId,
			status
    });

    return response.json({ mentoringSession });
  }
}
