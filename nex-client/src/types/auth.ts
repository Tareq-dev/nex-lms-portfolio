// export type Role =
//   | "student"
//   | "admin"
//   | "super-admin"
//   | "instructor";

  export const ROLES = [
  "admin",
  "student",
  "super-admin",
  "instructor",
] as const;

export type Role =
  (typeof ROLES)[number];

export interface AuthUser {
  email: string;
  name?: string;
}

export interface AuthPayload {
  user: AuthUser;
  role: Role;
}

export interface AuthSession
  extends AuthPayload {
  isAuthenticated: true;
}