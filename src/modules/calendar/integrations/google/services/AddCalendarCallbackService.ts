import { inject, injectable } from "tsyringe"
import { google } from "googleapis";

import { IMentoringSessionRepository } from "../../../../mentoring/repositories/IMentoringSessionRepository";
import { IUserRepository } from "../../../../users/repositories/IUserRepository";

import { AppError } from "../../../../../shared/errors/AppError";
import { convertMinutesToHourString } from "../../../../../shared/utils/convert-minutes-to-hour-string";
import { formatDateTime } from "../../../../../shared/utils/format-date-time";

import { mentoringConstants } from "../../../../mentoring/contants/mentoringContants";
import { userConstants } from "../../../../users/constants/userConstants";

@injectable()
export class AddCalendarCallbackService {
	constructor(
		@inject("MentoringSessionRepository")
		private mentoringSessionRepository: IMentoringSessionRepository,

		@inject("UserRepository")
		private userRepository: IUserRepository
	) { }

	async execute({
		code,
		mentoringSessionId
	}) {

		const oauth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.GOOGLE_REDIRECT_URL
		);

		const calendar = google.calendar({
			version: "v3",
			auth: process.env.GOOGLE_API_KEY
		})

		const { tokens } = await oauth2Client.getToken(code.toString());
		oauth2Client.setCredentials(tokens)

		const mentoringSession = await this.mentoringSessionRepository.findById(mentoringSessionId)

		if (!mentoringSession) {
			throw new AppError(mentoringConstants.SESSION_NOT_FOUND, 404)
		}

		const mentor = await this.userRepository.findById(mentoringSession.mentorId)

		if (!mentor) {
			throw new AppError(userConstants.NOT_FOUND, 404)
		}

		const hourStart = convertMinutesToHourString(mentoringSession.hourStart)
		const hourEnd = convertMinutesToHourString(mentoringSession.hourEnd)

		const { startDateTime, endDateTime } = formatDateTime(
			mentoringSession.scheduledAt,
			hourStart,
			hourEnd
		)

		const eventCreated = await calendar.events.insert({
			calendarId: 'primary',
			auth: oauth2Client,
			requestBody: {
				summary: 'Mentoria',
				description: `Sessão de mentoria com ${mentor.name}`,
				start: {
					dateTime: startDateTime,
					timeZone: 'America/Sao_Paulo',
				},
				end: {
					dateTime: endDateTime,
					timeZone: 'America/Sao_Paulo',
				}
			}
		})

		return eventCreated
	}
}
