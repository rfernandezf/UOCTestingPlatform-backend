import { User } from '@controllers/user';
import { UserRequest, userRequestSchema } from '@interfaces/controllers/user';
import { UserDAO } from '@models/userDAO';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();

export const getUsers = async (_req: express.Request, res: express.Response) => {
    try {
      let users = await new UserDAO().getAll();
      res.send(users);
    }
    catch(err: any) {
      console.log(err)
    }
  }

  export const postUser = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(userRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: UserRequest = _req.body;

      let user = new User(0, body.name, body.surnames, body.email, body.password, body.role_id);
      let users = await new UserDAO();
      user = await users.create(user);
      res.send(user);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const putUser = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(userRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: UserRequest = _req.body;
      let id: number = +_req.params.id;

      let user = new User(id, body.name, body.surnames, body.email, body.password, body.role_id);
      let Users = await new UserDAO();
      user = await Users.update(user);
      res.send(user);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const deleteUser = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let users = await new UserDAO();
      await users.delete(id);

      res.send();
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const getSingleUser = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let users = await new UserDAO();
      let user = await users.get(id);

      res.send(user);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

