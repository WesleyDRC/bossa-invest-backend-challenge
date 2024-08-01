import { Request, Response } from "express";
import { container } from "tsyringe";

import { AddCalendarCallbackService } from "../services/AddCalendarCallbackService";
import { AppError } from "../../../../../shared/errors/AppError";
import { googleContants } from "../contants/googleContants";




export class AddCalendarCallbackController {
	public async handle(request: Request, response: Response) {
		try {

			const { code, state: mentoringSessionId } = request.query

			if (!code) {
				throw new AppError(googleContants.AUTHORIZATION_CODE_REQUIRED, 400)
			}

			const addCalendarCallbackService = container.resolve(AddCalendarCallbackService)

			const eventCreated = await addCalendarCallbackService.execute({
				code,
				mentoringSessionId
			})

			response.status(201).json({eventCreated});

		} catch (error) {
			console.error("Error retrieving access token:", error);
			response.status(500).json({ error: "Failed to retrieve access token" });
		}
	}
}
