import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  role: "developer" | "founder";
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}