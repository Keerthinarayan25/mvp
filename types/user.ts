export type UserRole =  "developer" | "founder";

export interface AuthUser {

  id: number;

  name: string;

  email: string;

  roles: UserRole[];

  activeRole: UserRole;

  profileImage?: string | null;
}