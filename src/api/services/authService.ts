import bcrypt from "bcrypt";

import UserRepository from "../repositories/userRepository.js";
import TokenRepository from "../repositories/tokenRepository.js";
import { generateToken } from "../utils/jwt.js";

const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();

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

  return {
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  };
}

async function login(email: string, password: string) {
  const user = await userRepository.getOne(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  const activeToken = await tokenRepository.getActiveToken(user.id);
  if (activeToken) {
    activeToken.revoked = true;
    await tokenRepository.update(activeToken.id, activeToken); // revoke active token
  }

  const accessToken = generateToken({ id: user.id }, "access");
  const refreshToken = generateToken({ id: user.id }, "refresh");

  await tokenRepository.create(user.id, refreshToken); // create new refresh token

  await userRepository.update(user.id, { lastLogin: new Date() }); // update login date

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
}

async function logout(email: string, token: string) {
  const user = await userRepository.getOne(email);
  if (!user) {
    throw new Error("User not found");
  }

  const activeToken = await tokenRepository.getActiveToken(user.id);
  if (!activeToken) {
    throw new Error("User already logged out");
  }

  const isValidToken = await bcrypt.compare(token, activeToken.hashedToken);
  if (!isValidToken) {
    throw new Error("Invalid token");
  }

  await tokenRepository.update(activeToken.id, { revoked: true }); // revoke active token
}

export { signup, login, logout };
