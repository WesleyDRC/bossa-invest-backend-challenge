import { Request, Response } from "express";
import { container } from "tsyringe";

import { SessionService } from "../services/SessionService";

export class SessionController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const sessionService = container.resolve(SessionService);

    const token = await sessionService.execute({
      email,
      password,
    });

    return response.json({ token });
  }
}
