import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./api";



export function useLogin() {
    return useMutation({
        mutationFn : ({email , password} : {email:string ; password: string}) => login(email , password)
    })
}


export function useSignUp() {
    return useMutation({
        mutationFn : (userData : ISignupRequest) => signup(userData)
    })
}