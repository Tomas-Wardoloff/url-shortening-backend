import { Request, Response } from "express";
import { signup } from "../services/authService.js";

async function signupController(request: Request, response: Response) {
  const { firstName, lastName, email, password } = request.body;

  if (!firstName || !lastName || !email || !password) {
    response.status(400).send("Missing required fields");
  }

  try {
    const newUser = await signup(firstName, lastName, email, password);
    response.status(201).json({ message: "User created", data: newUser });
  } catch (error: any) {
    if (error.message === "User already exists") {
      response.status(409).json({ error: "User already exists" });
    }
    response.status(500).json({ error: "Internal server error" });
  }
}

async function loginController(request: Request, response: Response) {
  response.send("Login route");
}

async function logoutController(request: Request, response: Response) {
  response.send("Logout route");
}

export { signupController, loginController, logoutController };
