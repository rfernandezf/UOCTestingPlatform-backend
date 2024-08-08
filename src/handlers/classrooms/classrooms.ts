import { Classroom } from '@controllers/classroom';
import { ClassroomRequest, classroomRequestSchema } from '@interfaces/controllers/classroom';
import { ClassroomDAO } from '@models/classroomDAO';
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
      console.log(err)
    }
  }

  export const postClassroom = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(classroomRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: ClassroomRequest = _req.body;

      let classroom = new Classroom(0, body.name, body.description);
      let classrooms = await new ClassroomDAO();
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

      let classroom = new Classroom(id, body.name, body.description);
      let Classrooms = await new ClassroomDAO();
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

      let classrooms = await new ClassroomDAO();
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
      let id: number = +_req.params.id;

      let classrooms = await new ClassroomDAO();
      let classroom = await classrooms.get(id);

      res.send(classroom);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

