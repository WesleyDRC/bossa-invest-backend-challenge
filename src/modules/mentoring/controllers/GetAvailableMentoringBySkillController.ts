import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetAvailableMentoringBySkillService } from "../services/GetAvailableMentoringBySkillService";

import { AppError } from "../../../shared/errors/AppError";

export class GetAvailableMentoringBySkillController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const skill = request.query.skill;

		if (!skill) {
			throw new AppError("Skill is required", 400)
		}

		const getAvailableMentoringBySkillService = container.resolve(GetAvailableMentoringBySkillService)

		const mentoringAvailable = await getAvailableMentoringBySkillService.execute({ skill })

		return response.json({ mentoringAvailable })
	}
}