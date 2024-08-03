import { inject, injectable } from "tsyringe";

import { IMentoringSessionRepository } from "../repositories/IMentoringSessionRepository";
import { IUserRepository } from "../../users/repositories/IUserRepository";
import { IMentorAvailabilityRepository } from "../repositories/IMentorAvailabilityRepository";
import { IMentorAvailability } from "../domain/IMentorAvailability";
import { ISkill } from "../../skills/domain/ISkill";

import { AppError } from "../../../shared/errors/AppError";
import { convertHourStringToMinutes } from "../../../shared/utils/convert-hour-string-to-minutes";

import { userConstants } from "../../users/constants/userConstants";
import { mentoringConstants } from "../contants/mentoringContants";

interface ExecuteParams {
  mentorId: string;
  menteeId: string;
  skills: string[];
  hourStart: string;
  hourEnd: string;
  scheduledAt: string;
}

@injectable()
export class CreateMentoringSessionService {
  constructor(
    @inject("MentoringSessionRepository")
    private mentoringSessionRepository: IMentoringSessionRepository,

    @inject("MentorAvailabilityRepository")
    private mentorAvailabilityRepository: IMentorAvailabilityRepository,

    @inject("UserRepository")
    private userRepository: IUserRepository,
  ) {}

  async execute({ mentorId, menteeId, skills, hourStart, hourEnd, scheduledAt }: ExecuteParams) {
    const foundMentor = await this.userRepository.findById(mentorId);

    if (!foundMentor) {
      throw new AppError(userConstants.NOT_FOUND, 404);
    }

    const foundMentee = await this.userRepository.findById(menteeId);

    if (!foundMentee) {
      throw new AppError(userConstants.NOT_FOUND, 404);
    }

    const mentorSkills = await this.userRepository.getUserSkills(mentorId);

    const skillsFound = skills.filter((skill: string) =>
      mentorSkills.some((mentorSkill: ISkill) => mentorSkill.name === skill)
    );

    if (skillsFound.length === 0) {
      throw new AppError(userConstants.MENTOR_SKILL_NOT_FOUND, 404);
    }

    const foundMentorSkills = mentorSkills.filter((mentorSkill: ISkill) =>
      skills.includes(mentorSkill.name)
    );

    if (foundMentorSkills.length === 0) {
      throw new AppError(userConstants.MENTOR_SKILL_NOT_FOUND, 404);
    }

    const mentorAvailability = await this.mentorAvailabilityRepository.getAvailabilityByMentorId(
      mentorId
    );

    const isAvailableDay = mentorAvailability.find((avaiability: IMentorAvailability) => {
      return avaiability.availableDay.toString() === scheduledAt;
    });

    if (!isAvailableDay) {
      throw new AppError(mentoringConstants.UNAVAILABLE_MENTORING, 404);
    }

    const startAt = convertHourStringToMinutes(hourStart);
    const endAt = convertHourStringToMinutes(hourEnd);

    const hourStartMentoringAvailable = convertHourStringToMinutes(isAvailableDay.hourStart);
    const hourEndMentoringAvailable = convertHourStringToMinutes(isAvailableDay.hourEnd);

    if (endAt <= startAt) {
      throw new AppError(mentoringConstants.HOURS_ERROR, 403);
    }

    if (
      (startAt >= hourStartMentoringAvailable && startAt >= hourEndMentoringAvailable) ||
      endAt > hourEndMentoringAvailable
    ) {
      throw new AppError(mentoringConstants.FAILED_SCHEDULE, 400);
    }

    const overlappingSession = await this.mentoringSessionRepository.findMentoringSessionByHour({
      mentorId,
      startAt,
      endAt,
    });

    if (overlappingSession) {
      throw new AppError(mentoringConstants.TIME_IS_ALREADY_BOOKED, 400);
    }

    const mentoringSession = await this.mentoringSessionRepository.create({
      mentor: foundMentor,
      mentee: foundMentee,
      skills: foundMentorSkills,
      hourStart: convertHourStringToMinutes(hourStart),
      hourEnd: convertHourStringToMinutes(hourEnd),
      scheduledAt: scheduledAt,
    });

    return mentoringSession;
  }
}
