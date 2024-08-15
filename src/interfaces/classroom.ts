export interface ClassroomResponse {
    id: number,
    name: string,
    description: string
}

export interface ClassroomRequest {
    name: string,
    description: string   
}

export const classroomRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["description","name"],
    "properties": {
        "description": {
            "type": "string"
        },
        "name": {
            "type": "string"
        }
    },
    "type": "object"
}