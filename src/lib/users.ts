import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

// Mock in-memory user store. Replace with a real DB lookup later.
export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}
