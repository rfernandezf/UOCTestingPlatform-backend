export interface CustomHTTPError
{
  status: number;
  message: string;
}

export function parseErrorCode(err: any): CustomHTTPError
{
  let error: CustomHTTPError = {
    status: 500,
    message: "Unknown error"
  };

  if(err.message == 'ELEMENT_NOT_FOUND') { error.status = 404; error.message="Entity not found"; }
  else if(err.message == 'INPUT_VALIDATION_ERROR') { error.status = 400; error.message="Input validation error"; }
  else if(err.code == 'SQLITE_CONSTRAINT') { error.status = 409; error.message="Entity already exists"; }

  return error;
}