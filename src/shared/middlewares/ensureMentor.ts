import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";

import { UserRepository } from "../../modules/users/repositories/implementations/UserRepository";
import { AppError } from "../errors/AppError";

const ensureMentor = async (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	try {
		const userRepository = container.resolve(UserRepository)

		const userId = request.user.id

		const user = await userRepository.findById(userId)

		if(user.role.toLowerCase() !== "mentor"){
			throw new AppError("You are not allowed to continue.", 403)
		}

		next()
	} catch (error) {
		throw new AppError("You are not allowed to continue.", 403)
	}
}

export default ensureMentor