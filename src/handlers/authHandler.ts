import { JWTTokenRequest, JWTTokenRequestSchema, PasswordlessTokenRequest as PasscodeRequest, passwordlessTokenRequestSchema } from '@interfaces/auth';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';
import express from 'express';
const Ajv = require("ajv");
const ajv = new Ajv();
import nodemailer from 'nodemailer';
import { AuthService } from 'src/services/authService';
import jwt from 'jsonwebtoken';
import { environment } from '@utils/environment';
import { UserDAO } from '@models/userDAO';
import { User } from '@controllers/userController';

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
          // Generate JWT
          let token = jwt.sign({
            email: body.email
          }, process.env.BEARER_TOKEN_SECRET!, { expiresIn: environment.auth.jwtExpiration * 60 });

          // Check if user exists on the system. If not, front should ask user for basic data.
          let userDAO = new UserDAO();
          let missingUserData = false; 

          let user = await userDAO.getByEmail(body.email)
          .catch(async (err) => {
              let userRequest: User = new User(0, '', '', body.email, '', 2);

              // Add user to the DB
              user = await userDAO.create(userRequest);

              missingUserData = true;
          });

          if((user as User).name == '' || (user as User).surnames == '') missingUserData = true;


          res.send({jwt: token, missingUserData});
        }
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }