import jwt from "jsonwebtoken";

function generateToken(payload: { id: number }, type: "access" | "refresh") {
  const secret = process.env[`JWT_${type.toUpperCase()}_SECRET`];
  const expiration = process.env[`JWT_${type.toUpperCase()}_EXPIRATION`];

  if (!secret) {
    throw new Error(`${type} secret is not defined`);
  } else if (!expiration) {
    throw new Error(`${type} expiration is not defined`);
  }
  return jwt.sign(payload, secret, { expiresIn: parseInt(expiration, 10) });
}

function verifyToken(token: string) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("Access secret is not defined");
  }
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export { generateToken, verifyToken };
