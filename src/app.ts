import "reflect-metadata"
import "dotenv/config"
import "express-async-errors"
import "./shared/container/index"

import cors from "cors"
import express, { Express, Request, Response, NextFunction } from "express";
import { errors, isCelebrateError } from "celebrate"

import { AppError } from "./shared/errors/AppError"

import routes from "./shared/routes";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(routes)

app.use(errors)

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      metadata: err.metadata,
    });
  }

  if (isCelebrateError(err)) {
    const errorDetails = err.details.get('body') || err.details.get('query') || err.details.get('params') || err.details.get('headers');
    if (errorDetails) {
      return response.status(400).json({
        status: 'error',
        message: errorDetails.message,
      });
    }
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});


export default app