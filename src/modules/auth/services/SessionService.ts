import { inject, injectable } from "tsyringe";

import { IUserRepository } from "../../users/repositories/IUserRepository";
import { IHashProvider } from "../../../shared/container/providers/HashProvider/models/IHashProvider";
import { IUserCredentials } from "../dtos/IUserCredentials";
import { ITokenProvider } from "../../../shared/container/providers/TokenProvider/models/ITokenProvider";

import { AppError } from "../../../shared/errors/AppError";
import { userConstants } from "../../users/constants/userConstants";

@injectable()
export class SessionService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,

    @inject("TokenProvider")
    private tokenProvider: ITokenProvider
  ) {}

  async execute({ email, password }: IUserCredentials): Promise<string> {
    const foundUser = await this.userRepository.findByEmail(email);

    if (!foundUser) {
      throw new AppError(userConstants.NOT_FOUND, 404);
    }

    const isCorrectPassword = await this.hashProvider.compareHash(
      password,
      foundUser.password
    );

    if (!isCorrectPassword)
      throw new AppError(userConstants.INCORRECT_PASSWORD, 401);

    const token = this.tokenProvider.generate(foundUser.id);

    return Promise.resolve(token);
  }
}
