import { ExecutionPlatform } from '@controllers/executionPlatformController';
import { ExecutionPlatformRequest, executionPlatformRequestSchema } from '@interfaces/executionPlatform';
import { ExecutionPlatformDAO } from '@models/executionPlatformDAO';
import { environment } from '@utils/environment';
import Logger from '@utils/logger';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();
import * as fs from "fs";
import * as path from 'path';

export const getPlatforms = async (_req: express.Request, res: express.Response) => {
    try {
      let executionPlatforms = await new ExecutionPlatformDAO().getAll();
      res.send(executionPlatforms);
    }
    catch(err: any) {
      Logger.error(err);
    }
  }

  export const postPlatform = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(executionPlatformRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: ExecutionPlatformRequest = _req.body;

      let executionPlatform = new ExecutionPlatform(0, body.name);
      let executionPlatforms = new ExecutionPlatformDAO();
      executionPlatform = await executionPlatforms.create(executionPlatform);

      // Create a folder for the new platform
      if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName))) {
          fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName), { recursive: true });
      }
          
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

      let executionPlatform = new ExecutionPlatform(id, body.name);
      let executionPlatforms = new ExecutionPlatformDAO();
      let oldExecutionPlatform = await executionPlatforms.get(id);
      executionPlatform = await executionPlatforms.update(executionPlatform);

      // Edit folder name if exists, or create a new one if folder doesn't exists
      if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, oldExecutionPlatform.internalName))) {
        fs.renameSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, oldExecutionPlatform.internalName), 
          path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName));
      }

      else {
        fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName), { recursive: true });
      }

      res.send(executionPlatform);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const deletePlatform = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let executionPlatforms = new ExecutionPlatformDAO();
      let executionPlatform = await executionPlatforms.get(id);
      
      // Delete created folder and contents
      if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName))) {
        fs.rm(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName), { recursive: true }, () => {});
      }

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

      let executionPlatforms = new ExecutionPlatformDAO();
      let executionPlatform = await executionPlatforms.get(id);

      res.send(executionPlatform);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const getPlatformScript = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let executionPlatforms = new ExecutionPlatformDAO();
      let executionPlatform = await executionPlatforms.get(id);

      // Check for script existence
      if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName, environment.platforms.scriptName))) {
        // Read script file content
        let filePath = path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName, environment.platforms.scriptName);
        let fileContent = fs.readFileSync(filePath);
        res.send(fileContent.toString());
      }

      else res.send("");
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const putPlatformScript = async (_req: express.Request, res: express.Response) => {
    try {
      let body: string = _req.body;
      let id: number = +_req.params.id;

      let executionPlatforms = new ExecutionPlatformDAO();
      let executionPlatform : ExecutionPlatform = await executionPlatforms.get(id);

      // Create a folder for the new platform if it doesn't exists
      if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName))) {
        fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName), { recursive: true });
      }

      // Write body into the file
      let filePath = path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, executionPlatform.internalName, environment.platforms.scriptName);
      fs.writeFileSync(filePath, body);

      res.send()
    }
  
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }