export interface PasswordlessTokenRequest {
    email: string,
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