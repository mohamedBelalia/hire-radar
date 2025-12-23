export interface UserData {
    name: string,
    username: string, 
    profile_picture?: string,
    createdAt: string, 
    updatedAt: string,
}


export interface UpdateProfileForm {
    name: string,
    username: string, 
    profile_picture?: string,
    newPassword?: string,
    retypePassword?: string,
    oldPassword?: string,
}