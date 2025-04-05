import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authenticationMiddleware.js";
import AuthService from "../services/authService.js";

class AuthController {
  private authService = new AuthService();

  public signup = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { firstName, lastName, email, password } = request.body;

    if (!firstName || !lastName || !email || !password) {
      response.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const data = await this.authService.signup(
        firstName,
        lastName,
        email,
        password
      );
      response.status(201).json({ message: "User created", data: data });
      return;
    } catch (error: any) {
      if (error.message === "User already exists")
        response.status(409).json({ error: error.message });
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public login = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { email, password } = request.body;

    if (!email || !password) {
      response.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const data = await this.authService.login(email, password);
      response.status(200).json({ message: "User logged in", data: data });
      return;
    } catch (error: any) {
      if (error.message === "User not found")
        response.status(404).json({ error: error.message });
      else if (error.message === "Invalid password")
        response.status(401).json({ error: error.message });
      else if (error.message === "User already logged in")
        response.status(409).json({ error: error.message });
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public logout = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { refreshToken } = request.body;

    if (!refreshToken) {
      response.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      await this.authService.logout(user.id, refreshToken);
      response.status(200).json({ message: "User logged out" });
      return;
    } catch (error: any) {
      if (error.message === "User already logged out")
        response.status(409).json({ error: error.message });
      else if (error.message === "Invalid token")
        response.status(401).json({ error: error.message });
      response.status(500).json({ error: error.message });
      return;
    }
  };

  public refresh = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const user = request.user;
    const { refreshToken } = request.body;

    if (!refreshToken) {
      response.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const data = await this.authService.refresh(user.id, refreshToken);
      response.status(200).json({ message: "Token refreshed", data: data });
      return;
    } catch (error: any) {
      if (
        error.message === "Expired refresh token" ||
        error.message === "Invalid token"
      )
        response.status(401).json({ error: error.message });
      response.status(500).json({ error: error.message });
      return;
    }
  };
}

export default AuthController;
