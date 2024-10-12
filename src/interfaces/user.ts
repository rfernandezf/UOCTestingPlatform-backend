export enum UserRole {
    ADMIN=1,
    STUDENT=2
}

export interface UserResponse {
    id: number,
    name: string,
    surnames: string,
    email: string,
    role_id: number
}

export interface UserRequest {
    name: string,
    surnames: string,
    email: string,
    role_id: number    
}

export interface UserToClassroomRequest {
    password?: string 
}

export const userRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["email","name","role_id","surnames"],
    "properties": {
        "email": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "role_id": {
            "type": "number"
        },
        "surnames": {
            "type": "string"
        }
    },
    "type": "object"
}

export const userToClassroomRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": [],
    "properties": {
        "password": {
            "type": "string"
        }
    },
    "type": "object"
}