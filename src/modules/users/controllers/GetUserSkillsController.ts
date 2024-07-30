import { Request, Response } from "express"
import { container } from "tsyringe"

import { GetUserSkillsService } from "../services/GetUserSkillsService"

export class GetUserSkillsController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const userId = request.user.id

		const getUserSkillsService = container.resolve(GetUserSkillsService)

		const skills = await getUserSkillsService.execute({userId})

		return response.json({skills})
	}
}