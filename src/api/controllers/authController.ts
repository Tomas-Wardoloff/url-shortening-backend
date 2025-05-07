import { Request, Response } from "express";

import { TokenPayload } from "../utils/jwt.js";
import { BadRequestError } from "../utils/error.js";
import AuthService from "../services/authService.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class AuthController {
  private authService = new AuthService();

  public signup = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { firstName, lastName, email, password } = request.body;

    if (!firstName || !lastName || !email || !password)
      throw new BadRequestError("Missing required fields");

    const data = await this.authService.signup(
      firstName,
      lastName,
      email,
      password
    );
    response.status(201).json({ message: "User created", data: data });
  };

  public login = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { email, password } = request.body;

    if (!email || !password)
      throw new BadRequestError("Missing required fields");

    const data = await this.authService.login(email, password);
    response.status(200).json({ message: "User logged in", data: data });
  };

  public logout = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { refreshToken } = request.body;

    if (!refreshToken) throw new BadRequestError("Missing required fields");

    await this.authService.logout(userId, refreshToken);
    response.status(200).json({ message: "User logged out" });
  };

  public refresh = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { refreshToken } = request.body;

    if (!refreshToken) throw new BadRequestError("Missing required fields");

    const data = await this.authService.refresh(userId, refreshToken);
    response.status(200).json({ message: "Token refreshed", data: data });
  };

  public verifyEmail = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { email, token } = request.query;

    if (!email || !token) throw new BadRequestError("Missing required fields");

    await this.authService.verifyEmail(email as string, token as string);
    response.status(200).json({ message: "Email verified" });
  };

  public sendVerificationEmail = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { email } = request.body;

    if (!email) throw new BadRequestError("Missing required fields");

    await this.authService.sendVerificationEmail(email);
    response.status(200).json({ message: "Verification email sent" });
  };
}

export default AuthController;
