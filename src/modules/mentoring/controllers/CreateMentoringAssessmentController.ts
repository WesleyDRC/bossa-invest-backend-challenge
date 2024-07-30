import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateMentoringAssessmentService } from "../services/CreateMentoringAssessmentService";

export class CreateMentoringAssessmentController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const menteeId = request.user.id

		const {
			grade,
			comment,
			sessionId
		} = request.body

		const createMentoringAssessmentService = container.resolve(CreateMentoringAssessmentService)

		const mentoringAssessment = await createMentoringAssessmentService.execute({
			grade,
			comment,
			menteeId,
			sessionId
		})

		return response.json({ mentoringAssessment })
	}
}