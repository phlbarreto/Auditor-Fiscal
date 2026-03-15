export interface NewUser {
  name: string;
  password?: string;
  email: string;
  hashedPassword: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  password: string;
  hashedPassword: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}
