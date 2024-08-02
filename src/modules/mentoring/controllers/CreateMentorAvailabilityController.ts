import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateMentorAvailabilityService } from "../services/CreateMentorAvailabilityService";

export class CreateMentorAvailabilityController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const mentorId = request.user.id;

    const { hourStart, hourEnd, availableDay } = request.body;

    const createMentorAvailabilityService = container.resolve(CreateMentorAvailabilityService);

    const [day, month, year] = availableDay.split("-");

    const formattedDate = `${year}-${month}-${day}`;

    const mentoringAvailable = await createMentorAvailabilityService.execute({
      mentorId,
      hourStart,
      hourEnd,
      availableDay: formattedDate,
    });

    return response.json({ mentoringAvailable });
  }
}
