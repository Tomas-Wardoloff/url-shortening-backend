import bcrypt from "bcrypt";

import sendVerificationEmail from "../utils/emails.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import UserRepository from "../repositories/userRepository.js";
import TokenRepository from "../repositories/tokenRepository.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/error.js";

class AuthService {
  private userRepository = new UserRepository();
  private tokenRepository = new TokenRepository();

  public async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) throw new ConflictError("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    const verificationToken = generateToken({ id: newUser.id }, "verification");

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
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    if (!user.isVerified) throw new UnauthorizedError("Email not verified");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");

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
    if (!activeToken) throw new ConflictError("User already logged out");

    const isValidToken = await bcrypt.compare(token, activeToken.hashedToken);
    if (!isValidToken) throw new UnauthorizedError("Invalid token");

    await this.tokenRepository.update(activeToken.id, { revoked: true }); // revoke active token
  }

  public async refresh(userId: number, token: string) {
    const activeToken = await this.tokenRepository.getActiveToken(userId);
    if (!activeToken) throw new UnauthorizedError("Expired refresh token");

    const isValidToken = await bcrypt.compare(token, activeToken.hashedToken);
    if (!isValidToken) throw new UnauthorizedError("Invalid token");

    const accessToken = generateToken({ id: userId }, "access");

    return {
      tokens: {
        accessToken: accessToken,
      },
    };
  }

  public async verifyEmail(email: string, token: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    if (user.isVerified) throw new ConflictError("User already verified");

    const payload = verifyToken(token);
    if (payload.id != user.id) throw new UnauthorizedError("Invalid token");

    await this.userRepository.update(user.id, {
      isVerified: true,
    });

    return;
  }

  public async sendVerificationEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    if (user.isVerified) throw new ConflictError("User already verified");

    const verificationToken = generateToken({ id: user.id }, "verification");

    await sendVerificationEmail(user.email, verificationToken);

    return;
  }
}

export default AuthService;
