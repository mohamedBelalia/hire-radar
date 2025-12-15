import { getToken, removeToken, setToken } from "@/lib";
import apiClient from "@/lib/apiClient";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

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

/**
 * Authenticate a user and store the returned token.
 *
 * @returns `LoginResponse` containing the auth `token` and `user`
 */
export async function login(email: string, password: string) {
  const data = await authApi.login(email, password);
  setToken(data.token);
  return data;
}

/**
 * Create a new user account and store the returned authentication token.
 *
 * @param userData - Signup details: `full_name`, `password`, `confirmPassword`, `email`, and `role`
 * @returns The signup response containing `token` and the created `user`
 */
export async function signup(userData: ISignupRequest) {
  const { data } = await apiClient.post<ISignupResponse>("/api/auth/signup", {
    ...userData,
  });

  setToken(data.token);
  return data;
}

export const oAuth = async () => {
  const response = await apiClient.get(`/api/auth/google`);
  return response;
};

export const me = async (token?: string): Promise<User | null> => {
  try {
    if (token) {
      // If token is provided (e.g., from middleware), use it directly
      const { data } = await apiClient.get<User>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    }
    // Otherwise use the centralized API
    return await authApi.me();
  } catch (err) {
    return null;
  }
};


export const logout = async () =>{
  removeToken()
  return true;
}