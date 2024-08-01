import { inject, injectable } from "tsyringe"

import { IUserRepository } from "../../users/repositories/IUserRepository";
import { IMentorAvailabilityRepository } from "../repositories/IMentorAvailabilityRepository";

import { AppError } from "../../../shared/errors/AppError";
import { userConstants } from "../../users/constants/userConstants";
import { convertHourStringToMinutes } from "../../../shared/utils/convert-hour-string-to-minutes";
import { mentoringConstants } from "../contants/mentoringContants";

@injectable()
export class CreateMentorAvailabilityService {

	constructor(
		@inject("MentorAvailabilityRepository")
		private mentorAvailabilityRepository: IMentorAvailabilityRepository,

		@inject("UserRepository")
		private userRepository: IUserRepository,
	) { }

	async execute({
		mentorId,
		hourStart,
		hourEnd,
		availableDay
	}) {

		const foundMentor = await this.userRepository.findById(mentorId)

		if (!foundMentor) {
			throw new AppError(userConstants.NOT_FOUND, 404)
		}

		const hourStartMinutes = convertHourStringToMinutes(hourStart);
		const hourEndMinutes = convertHourStringToMinutes(hourEnd);

		if (hourEndMinutes < hourStartMinutes) {
			throw new AppError(mentoringConstants.HOURS_ERROR, 403)
		}

		const existingAvailabilities = await this.mentorAvailabilityRepository.getAvailabilityByMentorIdAndDate({
			mentorId,
			availableDay
		})

		const alreadyExistsTime = existingAvailabilities.some(availability => {
			const availabilityStart = convertHourStringToMinutes(availability.hourStart);
			const availabilityEnd = convertHourStringToMinutes(availability.hourEnd);

			return (
				(hourStartMinutes >= availabilityStart && hourStartMinutes <= availabilityEnd) ||
				(hourEndMinutes >= availabilityStart && hourEndMinutes <= availabilityEnd)
			)
		});

		if (alreadyExistsTime) {
			throw new AppError(mentoringConstants.TIME_IS_ALREADY_BOOKED, 400);
		}

		const mentorAvailability= await this.mentorAvailabilityRepository.create({
			mentor: foundMentor,
			hourStart: convertHourStringToMinutes(hourStart),
			hourEnd: convertHourStringToMinutes(hourEnd),
			availableDay
		})

		return mentorAvailability
	}
}
