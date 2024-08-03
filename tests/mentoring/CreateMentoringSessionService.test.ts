import "reflect-metadata";
import { container } from "tsyringe";

import { CreateMentoringSessionService } from "../../src/modules/mentoring/services/CreateMentoringSessionService";

import { IMentoringSessionRepository } from "../../src/modules/mentoring/repositories/IMentoringSessionRepository";
import { IMentorAvailabilityRepository } from "../../src/modules/mentoring/repositories/IMentorAvailabilityRepository";
import { IUserRepository } from "../../src/modules/users/repositories/IUserRepository";

import { convertHourStringToMinutes } from "../../src/shared/utils/convert-hour-string-to-minutes";

import { userConstants } from "../../src/modules/users/constants/userConstants";

enum UserType {
  MENTOR = "mentor",
  MENTEE = "mentee",
}

enum MentoringStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

describe("CreateMentoringSessionService", () => {
  let createMentoringSessionService: CreateMentoringSessionService;
  let mentoringSessionRepositoryMock: jest.Mocked<IMentoringSessionRepository>;
  let mentorAvailabilityRepositoryMock: jest.Mocked<IMentorAvailabilityRepository>;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mentoringSessionRepositoryMock = {
      create: jest.fn(),
      findMentoringSessionByHour: jest.fn(),
      findById: jest.fn(),
      findUserMentoringSessions: jest.fn(),
      updateMentoringStatus: jest.fn(),
    } as jest.Mocked<IMentoringSessionRepository>;

    mentorAvailabilityRepositoryMock = {
      create: jest.fn(),
      getAvailabilityByMentorId: jest.fn(),
      getAvailabilityByMentorIdAndDate: jest.fn(),
      getAvailableMentorsBySkill: jest.fn(),
    } as jest.Mocked<IMentorAvailabilityRepository>;

    userRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      addSkillUser: jest.fn(),
      getUserSkills: jest.fn(),
      findMentorsBySkill: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    container.registerInstance("MentoringSessionRepository", mentoringSessionRepositoryMock);
    container.registerInstance("MentorAvailabilityRepository", mentorAvailabilityRepositoryMock);
    container.registerInstance("UserRepository", userRepositoryMock);

    createMentoringSessionService = container.resolve(CreateMentoringSessionService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a mentoring session successfully", async () => {
    const mockMentor = {
      id: "1",
      name: "Test Mentor",
      email: "test_mentor@gmail.com",
      password: "wesley123",
      role: UserType.MENTOR,
      skills: [
        {
          id: "2",
          name: "javascript",
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockMentee = {
      id: "2",
      name: "Test Mentee",
      email: "test_mentee@gmail.com",
      password: "wesley123",
      role: UserType.MENTEE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockSkills = [
      {
        id: "1",
        name: "javascript",
      },
    ];

    const mockMentorSkill = {
      id: "1",
      name: "wesley",
      email: "test_mentor@gmail.com",
      password: "wesley123",
      role: UserType.MENTOR,
      skills: [
        {
          id: "1",
          name: "javascript",
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockAvailability = {
      id: "1",
      availableDay: "2024-08-02",
      hourStart: "10:00",
      hourEnd: "12:00",
      mentorId: "1",
      isAvailable: true,
    };

    const mocksAvailability = [
      {
        id: "1",
        availableDay: "2024-08-02",
        hourStart: "10:00",
        hourEnd: "12:00",
        mentorId: "1",
        isAvailable: true,
      },
    ];

    const mockMentoringSession = {
      id: "10",
      mentorId: "1",
      menteeId: "2",
      hourStart: convertHourStringToMinutes("10:00"),
      hourEnd: convertHourStringToMinutes("12:00"),
      skills: [
        {
          id: "1",
          name: "javascript",
        },
      ],
      status: MentoringStatus.SCHEDULED,
      scheduledAt: "2024-08-02",
    };

    userRepositoryMock.findById.mockResolvedValueOnce(mockMentor);
    userRepositoryMock.findById.mockResolvedValueOnce(mockMentee);
    userRepositoryMock.addSkillUser.mockResolvedValue(mockMentorSkill);
    userRepositoryMock.getUserSkills.mockResolvedValue(mockSkills);
    mentorAvailabilityRepositoryMock.create.mockResolvedValue(mockAvailability);
    mentorAvailabilityRepositoryMock.getAvailabilityByMentorId.mockResolvedValue(mocksAvailability);
    mentoringSessionRepositoryMock.findMentoringSessionByHour.mockResolvedValue(null);
    mentoringSessionRepositoryMock.create.mockResolvedValue(mockMentoringSession);

    const expectedResult = {
      id: "10",
      mentorId: "1",
      menteeId: "2",
      hourStart: 600,
      hourEnd: 720,
      skills: [{ id: "1", name: "javascript" }],
      status: "scheduled",
      scheduledAt: "2024-08-02",
    };

    await expect(
      createMentoringSessionService.execute({
        mentorId: "1",
        menteeId: "2",
        skills: ["javascript"],
        hourStart: "10:30",
        hourEnd: "11:30",
        scheduledAt: "2024-08-02",
      })
    ).resolves.toEqual(expectedResult);
  });

  it("should throw an error if the mentor is not found", async () => {
    const mockMentee = {
      id: "2",
      name: "Test Mentee",
      email: "test_mentee@gmail.com",
      password: "wesley123",
      role: UserType.MENTEE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMock.findById.mockResolvedValueOnce(mockMentee);

    const expectedResult = {
      message: userConstants.NOT_FOUND,
      metadata: undefined,
      statusCode: 404,
    };

    await expect(
      createMentoringSessionService.execute({
        mentorId: "1",
        menteeId: "2",
        skills: ["javascript"],
        hourStart: "10:30",
        hourEnd: "11:30",
        scheduledAt: "2024-08-02",
      })
    ).rejects.toEqual(expectedResult);
  });

  it("should throw an error if the mentee is not found", async () => {
    const mockMentor = {
      id: "1",
      name: "Test Mentor",
      email: "test_mentor@gmail.com",
      password: "wesley123",
      role: UserType.MENTEE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMock.findById.mockResolvedValueOnce(mockMentor);

    const expectedResult = {
      message: userConstants.NOT_FOUND,
      metadata: undefined,
      statusCode: 404,
    };

    await expect(
      createMentoringSessionService.execute({
        mentorId: "1",
        menteeId: "2",
        skills: ["javascript"],
        hourStart: "10:30",
        hourEnd: "11:30",
        scheduledAt: "2024-08-02",
      })
    ).rejects.toEqual(expectedResult);
  });

  it("should throw error if the mentor dos not have the skill", async () => {
    const mockMentor = {
      id: "1",
      name: "Test Mentor",
      email: "test_mentor@gmail.com",
      password: "wesley123",
      role: UserType.MENTOR,
      skills: [
        {
          id: "2",
          name: "javascript",
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockMentee = {
      id: "2",
      name: "Test Mentee",
      email: "test_mentee@gmail.com",
      password: "wesley123",
      role: UserType.MENTEE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockMentorSkill = {
      id: "1",
      name: "wesley",
      email: "test_mentor@gmail.com",
      password: "wesley123",
      role: UserType.MENTOR,
      skills: [
        {
          id: "1",
          name: "javascript",
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockSkills = [
      {
        id: "1",
        name: "HTML",
      },
    ];

    userRepositoryMock.findById.mockResolvedValueOnce(mockMentor);
    userRepositoryMock.findById.mockResolvedValueOnce(mockMentee);
    userRepositoryMock.addSkillUser.mockResolvedValue(mockMentorSkill);
    userRepositoryMock.getUserSkills.mockResolvedValue(mockSkills);

    const expectedResult = {
      message: userConstants.MENTOR_SKILL_NOT_FOUND,
      metadata: undefined,
      statusCode: 404,
    };

    await expect(
      createMentoringSessionService.execute({
        mentorId: "1",
        menteeId: "2",
        skills: ["javascript"],
        hourStart: "10:30",
        hourEnd: "11:30",
        scheduledAt: "2024-08-02",
      })
    ).rejects.toEqual(expectedResult);
  });
});
