export interface AssessmentResponse {
    id: number,
    name: string,
    description: string,
    publish_date: number,
    expiration_date: number,
    platform_id: number,
    classroom_id: number,
    test_path: string,
    file_name: string,
    max_failed_tests: number,
    max_retries: number
}

export interface AssessmentRequest {
    name: string,
    description: string,
    publish_date: number,
    expiration_date: number,
    platform_id: number,
    classroom_id: number,
    max_failed_tests: number,
    max_retries: number
}

export const assessmentRequestSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["classroom_id","description","expiration_date","name","platform_id","publish_date"],
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
        "max_failed_tests": {
            "type": "number",
            "minimum": 0
        },
        "max_retries": {
            "type": "number",
            "minimum": 0
        },
    },
    "type": "object"
}