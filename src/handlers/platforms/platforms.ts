import { ExecutionPlatform } from '@controllers/executionPlatform';
import { ExecutionPlatformRequest, executionPlatformRequestSchema } from '@interfaces/controllers/executionPlatform';
import { ExecutionPlatformDAO } from '@models/executionPlatformDAO';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();

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
      // Validate input
      const validate = ajv.compile(executionPlatformRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

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
      // Validate input
      const validate = ajv.compile(executionPlatformRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

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

