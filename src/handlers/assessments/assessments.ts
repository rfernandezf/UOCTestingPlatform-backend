
import { Assessment } from '@controllers/assessment';
import { AssessmentRequest, assessmentRequestSchema } from '@interfaces/controllers/assessment';
import { AssessmentDAO } from '@models/assessmentDAO';
import { epochToDate } from '@utils/dbUtils';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();

export const getAssessments = async (_req: express.Request, res: express.Response) => {
    try {
      let assessments = await new AssessmentDAO().getAll();
      res.send(assessments);
    }
    catch(err: any) {
      console.log(err)
    }
  }

  export const postAssessment = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(assessmentRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: AssessmentRequest = _req.body;

      let assessment = new Assessment(0, body.name, body.description, epochToDate(body.publish_date), epochToDate(body.expiration_date), body.platform_id, body.classroom_id, body.test_path);
      let assessments = await new AssessmentDAO();
      assessment = await assessments.create(assessment);
      res.send(assessment);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const putAssessment = async (_req: express.Request, res: express.Response) => {
    try {
      // Validate input
      const validate = ajv.compile(assessmentRequestSchema)
      if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

      let body: AssessmentRequest = _req.body;
      let id: number = +_req.params.id;

      let assessment = new Assessment(0, body.name, body.description, epochToDate(body.publish_date), epochToDate(body.expiration_date), body.platform_id, body.classroom_id, body.test_path);
      let Assessments = await new AssessmentDAO();
      assessment = await Assessments.update(assessment);
      res.send(assessment);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const deleteAssessment = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let assessments = await new AssessmentDAO();
      await assessments.delete(id);

      res.send();
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

  export const getSingleAssessment = async (_req: express.Request, res: express.Response) => {
    try {
      let id: number = +_req.params.id;

      let assessments = await new AssessmentDAO();
      let assessment = await assessments.get(id);

      res.send(assessment);
    }
    catch(err: any) {
      let error: CustomHTTPError = parseErrorCode(err);
      res.status(error.status).send(error.message);
    }
  }

