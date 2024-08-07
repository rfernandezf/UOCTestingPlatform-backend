import { ExecutionPlatform } from '@controllers/executionPlatform';
import { ExecutionPlatformDAO } from '@models/executionPlatformDAO';
import express from 'express';

interface ExecutionPlatformRequest
{
  name: string;
}

interface CustomHTTPError
{
  status: number;
  message: string;
}

export const getPlatforms = async (_req: express.Request, res: express.Response) => {
    try {
      let executionPlatforms = await new ExecutionPlatformDAO().getAll();
      res.send(executionPlatforms);
    }
    catch(err: any) {
      console.log(err)
    }
  }

  export const postPlatforms = async (_req: express.Request, res: express.Response) => {
    try {
      let body: ExecutionPlatformRequest = _req.body;

      let executionPlatform = new ExecutionPlatform(0, body.name)
      let executionPlatforms = await new ExecutionPlatformDAO();
      executionPlatform = await executionPlatforms.create(executionPlatform);
      res.send(executionPlatform);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const putPlatform = async (_req: express.Request, res: express.Response) => {
    try {
      let body: ExecutionPlatformRequest = _req.body;
      let id: number = +_req.params.id;

      let executionPlatform = new ExecutionPlatform(id, body.name)
      let executionPlatforms = await new ExecutionPlatformDAO();
      executionPlatform = await executionPlatforms.update(executionPlatform);
      res.send(executionPlatform);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const deletePlatforms = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let executionPlatforms = await new ExecutionPlatformDAO();
      await executionPlatforms.delete(id);

      res.send();
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const getSinglePlatform = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let executionPlatforms = await new ExecutionPlatformDAO();
      let executionPlatform = await executionPlatforms.get(id);

      res.send(executionPlatform);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  function parseErrorCode(err: any): CustomHTTPError
  {
    let error: CustomHTTPError = {
      status: 500,
      message: "Unknown error"
    };

    if(err.message == 'ELEMENT_NOT_FOUND') { error.status = 404; error.message="Entity not found"; }
    else if(err.code == 'SQLITE_CONSTRAINT') { error.status = 409; error.message="Entity already exists"; }

    return error;
  }