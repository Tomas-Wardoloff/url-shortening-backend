import { Request, Response } from "express";
import { signup, login } from "../services/authService.js";

async function signupController(
  request: Request,
  response: Response
): Promise<any> {
  const { firstName, lastName, email, password } = request.body;

  if (!firstName || !lastName || !email || !password) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  try {
    const data = await signup(firstName, lastName, email, password);
    return response.status(201).json({ message: "User created", data: data });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return response.status(409).json({ error: error.message });
    }
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function loginController(
  request: Request,
  response: Response
): Promise<any> {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  try {
    const data = await login(email, password);
    return response.status(200).json({ message: "User logged in", data: data });
  } catch (error: any) {
    if (error.message === "User not found") {
      return response.status(404).json({ error: error.message });
    }
    if (error.message === "Invalid password") {
      return response.status(401).json({ error: error.message });
    }
    if (error.message === "User already logged in") {
      return response.status(409).json({ error: error.message });
    }
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function logoutController(
  request: Request,
  response: Response
): Promise<any> {
  return response.send("Logout route");
}

export { signupController, loginController, logoutController };
