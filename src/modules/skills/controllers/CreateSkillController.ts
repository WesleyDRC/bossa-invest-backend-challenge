import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSkillService } from "../services/CreateSkillService";

export class CreateSkillController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const { name } = request.body

		const createSkillService = container.resolve(CreateSkillService)

		const skill = await createSkillService.execute({name})

		return response.json({skill})
	}
}