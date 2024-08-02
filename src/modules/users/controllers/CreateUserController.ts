import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserService } from "../services/CreateUserService";

export class CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, confirmPassword, role } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    return response.json({ user });
  }
}
