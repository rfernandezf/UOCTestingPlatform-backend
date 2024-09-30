import { JWTTokenRequest, JWTTokenRequestSchema, PasswordlessTokenRequest as PasscodeRequest, passwordlessTokenRequestSchema } from '@interfaces/auth';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();
import nodemailer from 'nodemailer';
import { AuthService } from 'src/services/authService';



export const requestPasscode = async (_req: express.Request, res: express.Response) => {
    try {
        // Validate input
        const validate = ajv.compile(passwordlessTokenRequestSchema)
        if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

        let body: PasscodeRequest = _req.body;

        // Generate a temporary response token and store it for 10 minutes
        let passcode: number = AuthService.getInstance().generateLoginPasscode(body.email);

        // Send the token through email
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'uoctestingplatform@gmail.com',
            pass: ''
          }
        });

        let mailOptions = {
            from: 'UOC Testing Platform',
            to: body.email,
            subject: 'Login passcode',
            text: 'Your login passcode: ' + passcode
          };

        console.log('----> MAIL TO SEND: ', mailOptions)

        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log('Error: ', error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });

        res.send();
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }


  export const requestJWTToken = async (_req: express.Request, res: express.Response) => {
    try {
        // Validate input
        const validate = ajv.compile(JWTTokenRequestSchema)
        if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

        let body: JWTTokenRequest = _req.body;

        // Validate the passcode
        if(!AuthService.getInstance().validatePasscode(body.email, body.passcode)) res.status(401).send();

        else
        {
          res.send({jwt: 'THIS IS MY TOKEN!!!!'});
        }
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }