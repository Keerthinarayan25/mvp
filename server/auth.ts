import jwt from "jsonwebtoken";

export interface SocketUser {
  id: number;
  name?: string;
  roles: string[];
  activeRole: "developer" | "founder";
}

export function verifySocketToken(token?: string): SocketUser | null {

  if (!token) {
    console.log("NO SOCKET TOKEN");
    return null;
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as SocketUser;

    // console.log("TOKEN VERIFIED");
    // console.log(decoded);

    return decoded;

  } catch (error) {

    console.log("VERIFY ERROR");
    console.log(error);

    return null;

  }

}
