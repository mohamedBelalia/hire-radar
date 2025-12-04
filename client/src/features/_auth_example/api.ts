import apiClient from "@/lib/apiClient";
import { clearToken, setToken } from "@/lib/auth";
import { ISignupRequest, ISignupResponse, LoginResponse } from "@/Types/AuthResponseTypes";



export async function login(email: string , password: string) {
    const { data } = await apiClient.post<LoginResponse>("/api/auth/login" , {email , password})

    setToken(data.access_token)
    return data
}


export async function signup(userData : ISignupRequest) {
    const { data } = await apiClient.post<ISignupResponse>("/api/auth/register" , {...userData})

    setToken(data.access_token)
    return data ;
}

export async function logout() {
    clearToken()
}