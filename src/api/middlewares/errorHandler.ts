import { emitWarning } from "process";
import { AppError } from "../utils/error.js";
import { NextFunction, Request, Response } from "express";

function ErrorHandler(
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (response.headersSent) {
    return next(error);
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Internal Server Error" });
}

export default ErrorHandler;
