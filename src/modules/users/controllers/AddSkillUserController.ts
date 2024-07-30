import { Request, Response } from "express";
import { container } from "tsyringe";

import { AddSkillUserService } from "../services/AddSkillUserService";

export class AddSkillUserController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const userId = request.user.id

		const { skillName } = request.body

		const addSkillUserService = container.resolve(AddSkillUserService)

		const user = await addSkillUserService.execute({ userId, skillName})

		return response.status(201).json({user})
	}
}