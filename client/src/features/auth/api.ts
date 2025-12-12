import { getToken, removeToken, setToken } from "@/lib";
import apiClient from "@/lib/apiClient";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  setToken(data.token);
  return data;
}

export async function signup(userData: ISignupRequest) {
  const { data } = await apiClient.post<ISignupResponse>("/auth/signup", {
    ...userData,
  });

  setToken(data.token);
  return data;
}

export const oAuth = async () => {
  const response = await apiClient.get(`/auth/google`);
  return response;
};

export const me = async (token?: string) => {
  try {
    const response = await apiClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
      },
    });
    return response.data;
  } catch (err) {
    return null;
  }
};


export const logout = async () =>{
  removeToken()
  return true;
}