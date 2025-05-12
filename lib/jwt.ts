import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "next-auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "asteria-mui-ne-resort-jwt-secret-key";
const JWT_EXPIRY = "24h"; // Token expires after 24 hours

/**
 * Generate JWT token for user
 */
export const generateToken = (user: Pick<User, "id" | "email" | "role">) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
