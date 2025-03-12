import jwt from "jsonwebtoken";

function generateToken(payload: { id: number }) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  } else if (!process.env.JWT_EXPIRATION) {
    throw new Error("JWT_EXPIRATION is not defined");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRATION, 10),
  });
}

function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export { generateToken, verifyToken };
