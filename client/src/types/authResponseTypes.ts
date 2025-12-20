import { User } from "./index";

export type ISignupRequest = {
  full_name: string;
  password: string;
  confirmPassword: string;
  email: string;
  role: string;
};

export type ISignupResponse = {
  token: string;
  user: User;
};

export type LoginResponse = {
  token: string;
  user: User;
};
