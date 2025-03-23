import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authMiddleware.js";
import AuthService from "../services/authService.js";

class AuthController {
  private authService = new AuthService();

  public signupController = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    const { firstName, lastName, email, password } = request.body;

    if (!firstName || !lastName || !email || !password)
      return response.status(400).json({ error: "Missing required fields" });

    try {
      const data = await this.authService.signup(
        firstName,
        lastName,
        email,
        password
      );
      return response.status(201).json({ message: "User created", data: data });
    } catch (error: any) {
      if (error.message === "User already exists")
        return response.status(409).json({ error: error.message });

      return response.status(500).json({ error: error.message });
    }
  };

  public loginController = async (
    request: Request,
    response: Response
  ): Promise<any> => {
    const { email, password } = request.body;

    if (!email || !password)
      return response.status(400).json({ error: "Missing required fields" });

    try {
      const data = await this.authService.login(email, password);
      return response
        .status(200)
        .json({ message: "User logged in", data: data });
    } catch (error: any) {
      if (error.message === "User not found")
        return response.status(404).json({ error: error.message });
      else if (error.message === "Invalid password")
        return response.status(401).json({ error: error.message });
      else if (error.message === "User already logged in")
        return response.status(409).json({ error: error.message });

      return response.status(500).json({ error: error.message });
    }
  };

  public logoutController = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const { refreshToken } = request.body;

    if (!refreshToken)
      return response.status(400).json({ error: "Missing required fields" });

    try {
      await this.authService.logout(user.id, refreshToken);
      return response.status(200).json({ message: "User logged out" });
    } catch (error: any) {
      if (error.message === "User already logged out")
        return response.status(409).json({ error: error.message });
      else if (error.message === "Invalid token")
        return response.status(401).json({ error: error.message });

      return response.status(500).json({ error: error.message });
    }
  };

  public refreshController = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const { refreshToken } = request.body;

    if (!refreshToken)
      return response.status(400).json({ error: "Missing required fields" });

    try {
      const data = await this.authService.refresh(user.id, refreshToken);
      return response
        .status(200)
        .json({ message: "Token refreshed", data: data });
    } catch (error: any) {
      if (
        error.message === "Expired refresh token" ||
        error.message === "Invalid token"
      )
        return response.status(401).json({ error: error.message });

      return response.status(500).json({ error: error.message });
    }
  };
}

export default AuthController;
