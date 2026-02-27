declare namespace Express {
  type AppRole = "SUPER_ADMIN" | "HR_ADMIN" | "HR_MANAGER";

  interface User {
    id: string;
    email: string;
    name: string;
    role: AppRole;
  }

  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role: AppRole;
    };
  }
}
