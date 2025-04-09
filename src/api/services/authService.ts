import bcrypt from "bcrypt";

import { generateToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/mail.js";
import UserRepository from "../repositories/userRepository.js";
import TokenRepository from "../repositories/tokenRepository.js";

class AuthService {
  private userRepository = new UserRepository();
  private tokenRepository = new TokenRepository();

  public async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const existingUser = await this.userRepository.getOne(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    const verificationToken = generateToken({ id: newUser.id }, "verification");

    await this.userRepository.update(newUser.id, {
      verificationToken: await bcrypt.hash(verificationToken, 10),
    }); // store hashed verification token

    await sendVerificationEmail(newUser.email, verificationToken);

    return {
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }

  public async login(email: string, password: string) {
    const user = await this.userRepository.getOne(email);
    if (!user) throw new Error("User not found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid password");

    const activeToken = await this.tokenRepository.getActiveToken(user.id);
    if (activeToken) {
      activeToken.revoked = true;
      await this.tokenRepository.update(activeToken.id, activeToken); // revoke active token
    }

    const accessToken = generateToken({ id: user.id }, "access");
    const refreshToken = generateToken({ id: user.id }, "refresh");

    await this.tokenRepository.create(user.id, refreshToken); // store new refresh token

    await this.userRepository.update(user.id, { lastLogin: new Date() }); // update login date

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

  public async logout(userId: number, token: string) {
    const activeToken = await this.tokenRepository.getActiveToken(userId);
    if (!activeToken) throw new Error("User already logged out");

    const isValidToken = await bcrypt.compare(token, activeToken.hashedToken);
    if (!isValidToken) throw new Error("Invalid token");

    await this.tokenRepository.update(activeToken.id, { revoked: true }); // revoke active token
  }

  public async refresh(userId: number, token: string) {
    const activeToken = await this.tokenRepository.getActiveToken(userId);
    if (!activeToken) throw new Error("Expired refresh token");

    const isValidToken = await bcrypt.compare(token, activeToken.hashedToken);
    if (!isValidToken) throw new Error("Invalid token");

    const accessToken = generateToken({ id: userId }, "access");

    return {
      tokens: {
        accessToken: accessToken,
      },
    };
  }
}

export default AuthService;
