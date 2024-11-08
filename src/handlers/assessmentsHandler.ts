
import { Assessment } from '@controllers/assessmentController';
import { AssessmentRequest, assessmentRequestSchema } from '@interfaces/assessment';
import { AssessmentDAO } from '@models/assessmentDAO';
import { environment } from '@utils/environment';
import { epochToDate } from '@utils/dbUtils';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();
import * as fs from "fs";
import * as path from 'path';
import { TestExecution } from '@handlers/testExecutionHandler';
import { SSEConnectionHandler } from 'src/services/sseConnection';
import Logger from '@utils/logger';
import { UserDAO } from '@models/userDAO';
import { AssessmentExecutionDAO } from '@models/assessmentExecutionDAO';

export const getAssessments = async (_req: express.Request, res: express.Response) => {
  try {
    let assessments = await new AssessmentDAO().getAll();
    res.send(assessments);
  }
  catch(err: any) {
    Logger.error(err);
  }
}

export const postAssessment = async (_req: express.Request, res: express.Response) => {
  try {
    // Validate input
    const validate = ajv.compile(assessmentRequestSchema)
    if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

    let body: AssessmentRequest = _req.body;

    let assessment = new Assessment(0, body.name, body.description, epochToDate(body.publish_date), epochToDate(body.expiration_date), body.platform_id, body.classroom_id, '');
    let assessments = await new AssessmentDAO();
    assessment = await assessments.create(assessment);

    // Create a folder with the UUID inside assessments folder
    if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath))) {
        fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath), { recursive: true });
    }

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

    let assessment = new Assessment(id, body.name, body.description, epochToDate(body.publish_date), epochToDate(body.expiration_date), body.platform_id, body.classroom_id);
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
    let assessment = await assessments.get(id);
    
    // Delete created folder and contents
    if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath))) {
        fs.rmSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath), { recursive: true });
    }
    
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

export const uploadAssessmentFiles = async (_req: express.Request, res: express.Response) => {
  try {
    let id: number = +_req.params.id;

    let assessments = await new AssessmentDAO();
    let assessment = await assessments.get(id);

    // Create a folder with the UUID inside assessments folder
    if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath))) {
      fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath), { recursive: true });
    }
    
    if(_req.file)
    {
      let filePath = path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath, _req.file.originalname)
      fs.writeFileSync(filePath, _req.file.buffer);

      assessment.fileName = _req.file.originalname;
      assessments.update(assessment);

      res.send();
    }

    else throw new Error("INPUT_VALIDATION_ERROR");
  }

  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

export const deleteAssessmentFiles = async (_req: express.Request, res: express.Response) => {
  try {
    let id: number = +_req.params.id;

    let assessments = await new AssessmentDAO();
    let assessment = await assessments.get(id);

    // Delete created folder and contents
    if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath))) {
      fs.rmSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath) , { recursive: true });
    }

    assessment.fileName = '';
    assessments.update(assessment);

    res.send();
  }
  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

export const getAssessmentsInClassroom = async (_req: express.Request, res: express.Response) => {
  try {
    let classroomId: number = +_req.params.id_classroom;

    let assessments = await new AssessmentDAO();
    let assessment = await assessments.getByClassroom(classroomId);

    res.send(assessment);
  }
  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

/**
 * Phases:
 * - Student uploads the assessment to this endpoint
 * - Get related ExecutionPlatform
 * - Assign a new UUID to the run
 * - Create a folder for the run based on that execution UUID
 * - Uncompress student's assessment and teacher's test battery into the same folder
 * - Delete zip files
 * - Run execution platform script (run.sh)
 * - Get results back to node
 * - Delete execution folder
 * - Send results back to the frontend (API REST for getting the results or WSS/SSE for getting them on real time, let's see...)
 */
export const runAssessment = async (_req: express.Request, res: express.Response) => {
  try {
    let userEmail: string = '';
    if(_req.headers['user'] as string) userEmail = _req.headers['user'] as string;

    let users = await new UserDAO();

    let userID: number = (await users.getByEmail(userEmail)).id;

    let id: number = +_req.params.id;
    let sseClientId: string = _req.params.sseClientId;

    let assessments = await new AssessmentDAO();
    let assessment = await assessments.get(id);

    // Create a folder with the UUID inside assessments folder
    if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessmentTests, assessment.testPath, assessment.fileName))) {
      throw new Error("NO_UNITARY_TESTS_FOUND");
    }

    // Check if SSE connection is active
    if(!SSEConnectionHandler.getInstance().checkConnection(sseClientId)) throw new Error("NO_SSE_CONNECTION");
    
    if(_req.file)
    {
      // Create new execution
      let testExecution: TestExecution = new TestExecution(assessment, userID, _req.file.buffer, sseClientId);

      await testExecution.run();
      res.status(202).send();
    }

    else throw new Error("INPUT_VALIDATION_ERROR");
  }

  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

export const downloadAssessmentFile = async (_req: express.Request, res: express.Response) => {
  try {
    let id: number = +_req.params.id;

    let assessmentExecution = await new AssessmentExecutionDAO();
    let assessmentRun = await assessmentExecution.get(id);

    let assessmentFilePath = path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessmentRun.executionID, "assessment.zip");
    console.log('----> DOWNLOAD: ', assessmentFilePath)

    res.setHeader('Content-disposition', 'attachment; filename=assessment.zip');
    res.setHeader('Content-type', 'application/zip');

    // Download assessment file
    if (fs.existsSync(assessmentFilePath)) {
        //res.send(fs.readFileSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessmentRun.executionID, "assessment.zip")));
        // var filestream = fs.createReadStream(assessmentFilePath);
        // filestream.pipe(res);
        // res.send()
        res.download(assessmentFilePath, "assessment.zip");
      }
    
    else throw new Error("ELEMENT_NOT_FOUND");
  }
  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

export const getAssessmentsRunInfoByUser = async (_req: express.Request, res: express.Response) => {
  try {
    let assessmentID: number = +_req.params.id;

    let userEmail: string = '';
    if(_req.headers['user'] as string) userEmail = _req.headers['user'] as string;

    let users = await new UserDAO();

    let userID: number = (await users.getByEmail(userEmail)).id;

    let assessmentExecution = await new AssessmentExecutionDAO();

    let assessmentRuns = await assessmentExecution.getByUserID(assessmentID, userID);

    res.send(assessmentRuns);
  }
  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}

export const getAssessmentRunInfo = async (_req: express.Request, res: express.Response) => {
  try {
    let id: number = +_req.params.id;

    let assessmentExecution = await new AssessmentExecutionDAO();
    let assessmentRun = await assessmentExecution.get(id);

    res.send(assessmentRun);
  }
  catch(err: any) {
    let error: CustomHTTPError = parseErrorCode(err);
    res.status(error.status).send(error.message);
  }
}