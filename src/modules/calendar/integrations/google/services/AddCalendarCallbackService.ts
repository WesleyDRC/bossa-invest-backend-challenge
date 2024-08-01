import { inject, injectable } from "tsyringe"
import { google } from "googleapis";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
dayjs.extend(timezone)

import { IMentoringSessionRepository } from "../../../../mentoring/repositories/IMentoringSessionRepository";
import { IUserRepository } from "../../../../users/repositories/IUserRepository";

import { AppError } from "../../../../../shared/errors/AppError";
import { convertMinutesToHourString } from "../../../../../shared/utils/convert-minutes-to-hour-string";

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

		let { startDateTime, endDateTime } = this.formatDateTime(
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
					'dateTime': startDateTime,
					'timeZone': 'Brazil/East',
				},
				end: {
					dateTime: endDateTime,
					timeZone: 'Brazil/East',
				}
			}
		})

		return eventCreated
	}

	private formatDateTime = (scheduledAt, hourStart, hourEnd) => {
		const startDate = dayjs.tz(`${scheduledAt}T${hourStart}:00`);
		const endDate = dayjs.tz(`${scheduledAt}T${hourEnd}:00`);

		return {
			startDateTime: startDate.format(),
			endDateTime: endDate.format()
		};
	};
}