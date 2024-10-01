export interface PasswordlessTokenRequest {
    email: string,
}

export interface JWTTokenRequest {
    email: string,
    passcode: string
}

export const passwordlessTokenRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["email"],
    "properties": {
        "email": {
            "type": "string"
        }
    },
    "type": "object"
}

export const JWTTokenRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["email", "passcode"],
    "properties": {
        "email": {
            "type": "string"
        },
        "passcode": {
            "type": "string"
        }
    },
    "type": "object"
}