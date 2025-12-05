import { setToken } from "@/lib"
import apiClient from "@/lib/apiClient"

export async function login(email: string , password: string) {
    const { data } = await apiClient.post<LoginResponse>("/auth/login" , {email , password})

    setToken(data.token)
    return data
}


export async function signup(userData : ISignupRequest) {
    const { data } = await apiClient.post<ISignupResponse>("/auth/signup" , {...userData})

    setToken(data.token)
    return data ;
}
