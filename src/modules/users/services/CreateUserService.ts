import { inject, injectable } from "tsyringe";

import { IStoreUserDto } from "../dtos/IStoreUserDto";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUser } from "../domain/IUser";
import { IHashProvider } from "../../../shared/container/providers/HashProvider/models/IHashProvider";

import { AppError } from "../../../shared/errors/AppError";
import { userConstants } from "../constants/userConstants";
import { User } from "../domain/User";

@injectable()
export class CreateUserService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  async execute({
    name,
    email,
    password,
    confirmPassword,
    role,
  }: IStoreUserDto): Promise<IUser> {
    const foundUser = await this.userRepository.findByEmail(email);

    if (foundUser) {
      throw new AppError(userConstants.ALREADY_REGISTERED, 409);
    }

    const user = User.create(email, password, confirmPassword);

    const encryptedPassword = await this.hashProvider.generateHash(
      user.password
    );

    const userCreated = await this.userRepository.create({
      name,
      email,
      password: encryptedPassword,
      role,
    });

    delete userCreated.password;

    return userCreated;
  }
}
