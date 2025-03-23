import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authMiddleware.js";
import { signup, login, logout, refresh } from "../services/authService.js";

async function signupController(
  request: Request,
  response: Response
): Promise<any> {
  const { firstName, lastName, email, password } = request.body;

  if (!firstName || !lastName || !email || !password)
    return response.status(400).json({ error: "Missing required fields" });

  try {
    const data = await signup(firstName, lastName, email, password);
    return response.status(201).json({ message: "User created", data: data });
  } catch (error: any) {
    if (error.message === "User already exists")
      return response.status(409).json({ error: error.message });

    return response.status(500).json({ error: "Internal server error" });
  }
}

async function loginController(
  request: Request,
  response: Response
): Promise<any> {
  const { email, password } = request.body;

  if (!email || !password)
    return response.status(400).json({ error: "Missing required fields" });

  try {
    const data = await login(email, password);
    return response.status(200).json({ message: "User logged in", data: data });
  } catch (error: any) {
    if (error.message === "User not found")
      return response.status(404).json({ error: error.message });
    else if (error.message === "Invalid password")
      return response.status(401).json({ error: error.message });
    else if (error.message === "User already logged in")
      return response.status(409).json({ error: error.message });

    return response.status(500).json({ error: "Internal server error" });
  }
}

async function logoutController(
  request: AuthRequest,
  response: Response
): Promise<any> {
  const user = request.user;
  const { refreshToken } = request.body;

  if (!refreshToken)
    return response.status(400).json({ error: "Missing required fields" });

  try {
    await logout(user.id, refreshToken);
    return response.status(200).json({ message: "User logged out" });
  } catch (error: any) {
    if (error.message === "User already logged out")
      return response.status(409).json({ error: error.message });
    else if (error.message === "Invalid token")
      return response.status(401).json({ error: error.message });

    return response.status(500).json({ error: "Internal server error" });
  }
}

async function refreshController(
  request: AuthRequest,
  response: Response
): Promise<any> {
  const user = request.user;
  const { refreshToken } = request.body;

  if (!refreshToken)
    return response.status(400).json({ error: "Missing required fields" });

  try {
    const data = await refresh(user.id, refreshToken);
    return response
      .status(200)
      .json({ message: "Token refreshed", data: data });
  } catch (error: any) {
    if (
      error.message === "Expired refresh token" ||
      error.message === "Invalid token"
    )
      return response.status(401).json({ error: error.message });

    return response.status(500).json({ error: "Internal server error" });
  }
}

export {
  signupController,
  loginController,
  logoutController,
  refreshController,
};
