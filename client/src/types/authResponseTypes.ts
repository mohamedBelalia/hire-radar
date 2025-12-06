type ISignupRequest = {
  full_name: string;
  password: string;
  confirmPassword: string;
  email: string;
  role: string;
};

type ISignupResponse = {
  token: string;
  user: User;
};

type LoginResponse = {
  token: string;
  user: User;
};
