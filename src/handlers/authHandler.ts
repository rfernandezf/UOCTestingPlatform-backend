import { PasswordlessTokenRequest, passwordlessTokenRequestSchema } from '@interfaces/auth';
import Logger from '@utils/logger';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();

export const getPasswordlessToken = async (_req: express.Request, res: express.Response) => {
    try {
        // Validate input
        const validate = ajv.compile(passwordlessTokenRequestSchema)
        if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

        let body: PasswordlessTokenRequest = _req.body;
        console.log('----> Received email:', body);

        res.send();
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }