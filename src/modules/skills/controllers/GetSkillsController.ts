import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetSkillsService } from "../services/GetSkillsService";

export class GetSkillsController {
	public async handle(request: Request, response: Response): Promise<Response> {
		const getSkillsService = container.resolve(GetSkillsService)

		const skills = await getSkillsService.execute()

		return response.json({ skills })
	}
}