import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetMentorsBySkillService } from "../services/GetMentorsBySkillService";
import { AppError } from "../../../shared/errors/AppError";

export class GetMentorsBySkillController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const skill = request.query.skill;

    if (!skill) {
      throw new AppError("Skill is required", 400);
    }

    const getMentorsBySkillService = container.resolve(GetMentorsBySkillService);

    const mentors = await getMentorsBySkillService.execute({ skill });

    return response.json({ mentors });
  }
}
