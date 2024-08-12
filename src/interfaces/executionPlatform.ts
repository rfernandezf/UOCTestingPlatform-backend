export interface ExecutionPlatformResponse {
    id: number,
    name: string,
    internal_name: string
}

export interface ExecutionScriptResponse {
  name?: string;
  method?: string;
  status: string;
  time?: number;
  description?: string;
}

export interface ExecutionPlatformRequest
{
  name: string;
}

export const executionPlatformRequestSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": ["name"],
  "properties": {
      "name": {
          "type": "string"
      }
  },
  "type": "object"
}