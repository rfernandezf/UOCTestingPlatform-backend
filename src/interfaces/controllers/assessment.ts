export interface AssessmentResponse {
    id: number,
    name: string,
    description: string,
    publish_date: number,
    expiration_date: number,
    platform_id: number,
    classroom_id: number,
    test_path: string,
    file_name: string
}

export interface AssessmentRequest {
    name: string,
    description: string,
    publish_date: number,
    expiration_date: number,
    platform_id: number,
    classroom_id: number,
    test_path: string  
}

export const assessmentRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["classroom_id","description","expiration_date","name","platform_id","publish_date","test_path"],
    "properties": {
        "classroom_id": {
            "type": "number"
        },
        "description": {
            "type": "string"
        },
        "expiration_date": {
            "type": "number"
        },
        "name": {
            "type": "string"
        },
        "platform_id": {
            "type": "number"
        },
        "publish_date": {
            "type": "number"
        },
        "test_path": {
            "type": "string"
        }
    },
    "type": "object"
}