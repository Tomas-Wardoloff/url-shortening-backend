import bcrypt from "bcrypt";

import UserRepository from "../repositories/userRepository.js";
import { generateToken } from "../utils/jwt.js";

const userRepository = new UserRepository();

async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const existingUser = await userRepository.getOne(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.create(
    firstName,
    lastName,
    email,
    hashedPassword
  );

  const token = generateToken({ id: newUser.id });

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
    },
    token,
  };
}

export { signup };
