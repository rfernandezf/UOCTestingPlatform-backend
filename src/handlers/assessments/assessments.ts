
import { Assessment } from '@controllers/assessment';
import { AssessmentRequest, assessmentRequestSchema } from '@interfaces/controllers/assessment';
import { AssessmentDAO } from '@models/assessmentDAO';
import { environment } from '@utils/environment';
import { epochToDate } from '@utils/dbUtils';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();
import * as fs from "fs";
import * as path from 'path';

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

      let assessment = new Assessment(0, body.name, body.description, epochToDate(body.publish_date), epochToDate(body.expiration_date), body.platform_id, body.classroom_id);
      let assessments = await new AssessmentDAO();
      assessment = await assessments.create(assessment);

      // Create a folder with the UUID inside assessments folder
      if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath))) {
          fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath), { recursive: true });
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
      if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath))) {
          fs.rm(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath), { recursive: true }, () => {});
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
      if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath))) {
        fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath), { recursive: true });
      }
      
      if(_req.file)
      {
        let filePath = path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath, _req.file.originalname)
        fs.writeFileSync(filePath, _req.file.buffer);

        assessment.fileName = _req.file.originalname;
        assessments.update(assessment);

        // import * as fs from "fs";
        // import yauzl from 'yauzl';
        // // Uncompress the file and delete the zip
        // yauzl.open(filePath, {lazyEntries: true}, function(err: Error | null, zipfile: yauzl.ZipFile) {
        //   if (err) throw err;
        //   zipfile.readEntry();
        //   zipfile.on("entry", function(entry: any) {
        //     if (/\/$/.test(entry.fileName)) {
        //       // Directory file names end with '/'.
        //       // Note that entries for directories themselves are optional.
        //       // An entry's fileName implicitly requires its parent directories to exist.
        //       if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath) + "/" + entry.fileName)){
        //         fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath) + "/" + entry.fileName, { recursive: true });
        //       }
        //       zipfile.readEntry();
        //     } 
        //     else if(/^(__MACOSX\/).*$/.test(entry.fileName)) zipfile.readEntry();
        //     else {
        //       // file entry
        //       zipfile.openReadStream(entry, function(err: Error | null, readStream: any) {
        //         if (err) throw err;                
                
        //         var fileStream = fs.createWriteStream(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath) + "/" + entry.fileName);
        //         readStream.pipe(fileStream);

        //         readStream.on("end", function() {
        //           zipfile.readEntry();
        //         });

        //       });
        //     }
        //   });
        // });

        // // Delete the zip file
        // if (fs.existsSync(filePath)){
        //   fs.unlinkSync(filePath);
        // }

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
      if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath))) {
        fs.rm(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment.testPath) , { recursive: true }, () => {});
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
