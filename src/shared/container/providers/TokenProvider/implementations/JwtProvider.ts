import { ITokenProvider } from "../models/ITokenProvider";
import jwt from "jsonwebtoken";

export class JwtProvider implements ITokenProvider {
  private secret: string;

  constructor() {
    this.secret = process.env.APP_SECRET as string;
  }

  generate(userId: string): string {
    return jwt.sign(userId, this.secret);
  }
}
