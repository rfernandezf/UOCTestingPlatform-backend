export interface ExecutionPlatformResponse {
    id: number,
    name: string
}

export interface ExecutionPlatformRequest
{
  name: string;
}

export const executionPlatformRequestSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
      "name": {
          "type": "string"
      }
  },
  "type": "object"
}