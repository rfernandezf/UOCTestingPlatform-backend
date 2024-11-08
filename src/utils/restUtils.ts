import Logger from "./logger";

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

  Logger.error('----> API ERROR: ' + err.message);

  if(err.message == 'ELEMENT_NOT_FOUND') { error.status = 404; error.message="Entity not found"; }
  else if(err.message == 'INPUT_VALIDATION_ERROR') { error.status = 400; error.message="Input validation error"; }
  else if(err.message == 'UNAUTHORIZED') { error.status = 401; error.message="Permission denied"; }
  else if(err.message == 'NO_SSE_CONNECTION') { error.status = 412; error.message="No SSE connection with the client found"; }
  else if(err.message == 'NO_UNITARY_TESTS_FOUND') { error.status = 412; error.message="No unitary tests found for this assessment"; }
  else if(err.message == 'NO_EXECUTION_SCRIPT_FOUND') { error.status = 412; error.message="No execution script found for this assessment"; }
  else if(err.message == 'ERROR_EXECUTING_SCRIPT') { error.status = 500; error.message="Internal error executing platform script"; }
  else if(err.code == 'SQLITE_CONSTRAINT' && err.message.includes("UNIQUE")) { error.status = 409; error.message="Entity already exists"; }
  else if(err.code == 'SQLITE_CONSTRAINT' && err.message.includes("FOREIGN KEY")) { error.status = 422; error.message="Foreign key violation"; }

  return error;
}