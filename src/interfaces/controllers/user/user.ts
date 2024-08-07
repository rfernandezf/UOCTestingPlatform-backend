export enum UserRole {
    ADMIN=1,
    STUDENT=2
}

export interface UserResponse {
    id: number,
    name: string,
    surnames: string,
    email: string,
    password: string,
    role_id: number
}