import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "next-auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "asteria-mui-ne-resort-jwt-secret-key";
const JWT_EXPIRY = "24h"; // Token hết hạn sau 24 giờ

/**
 * Tạo JWT token cho người dùng
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
 * Xác thực JWT token
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Giải mã JWT token mà không xác thực
 */
export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
