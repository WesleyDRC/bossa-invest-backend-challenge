import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateMentoringSessionService } from "../services/CreateMentoringSessionService";

export class CreateMentoringSessionController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const menteeId = request.user.id

		const {
			mentorId,
			skills,
			hourStart,
			hourEnd,
			scheduledAt
		} = request.body
		
		const createMentoringSessionService = container.resolve(CreateMentoringSessionService)

		const [day, month, year] = scheduledAt.split('-');

		const formattedDate = `${year}-${month}-${day}`

		const mentoringSession = await createMentoringSessionService.execute({
			mentorId,
			menteeId,
			skills,
			hourStart,
			hourEnd,
			scheduledAt: formattedDate
		})

		return response.json({mentoringSession})
	}
}