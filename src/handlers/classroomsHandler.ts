import { Classroom } from '@controllers/classroomControlller';
import { ClassroomRequest, classroomRequestSchema } from '@interfaces/classroom';
import { ClassroomDAO } from '@models/classroomDAO';
import Logger from '@utils/logger';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();

export const getClassrooms = async (_req: express.Request, res: express.Response) => {
    try {
      let classrooms = await new ClassroomDAO().getAll();
      res.send(classrooms);
    }
    catch(err: any) {
      Logger.error(err);
    }
  }

  export const postClassroom = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(classroomRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: ClassroomRequest = _req.body;

      let classroom = new Classroom(0, body.name, body.description, body.password);
      let classrooms = new ClassroomDAO();
      classroom = await classrooms.create(classroom);
      res.send(classroom);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const putClassroom = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(classroomRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: ClassroomRequest = _req.body;
      let id: number = +_req.params.id;

      let classroom = new Classroom(id, body.name, body.description, body.password);
      let Classrooms = new ClassroomDAO();
      classroom = await Classrooms.update(classroom);
      res.send(classroom);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const deleteClassroom = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let classrooms = new ClassroomDAO();
      await classrooms.delete(id);

      res.send();
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const getSingleClassroom = async (_req: express.Request, res: express.Response) => {
    try {
      let id: any = _req.params.id;

      let classrooms = new ClassroomDAO();
      let classroom: Classroom;

      if(!isNaN(Number(id))) classroom = await classrooms.get(id);
      else classroom = await classrooms.getByUUID(id);

      classroom.password = ""; // Remove classroom password from the object for security reasons

      res.send(classroom);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }