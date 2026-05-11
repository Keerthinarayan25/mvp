import jwt from "jsonwebtoken";

export type UserRole =
  | "developer"
  | "founder";

export interface JwtPayload {
  id: number;
  roles: UserRole[];
  activeRole: UserRole;
}

const JWT_SECRET =  process.env.JWT_SECRET!;

export function signToken(payload: JwtPayload) {

  return jwt.sign(payload,JWT_SECRET,{
      expiresIn: "7d",
    }
  );
}

export function verifyToken(token: string) {

  try {

    return jwt.verify(token,JWT_SECRET) as JwtPayload;

  } catch {

    throw new Error(
      "Invalid token"
    );
  }
}