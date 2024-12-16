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
import { generateEmailTemplate } from './emailTemplate';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const requestPasscode = async (_req: express.Request, res: express.Response) => {
    try {
        // Validate input
        const validate = ajv.compile(passwordlessTokenRequestSchema)
        if (!validate(_req.body)) throw new Error('INPUT_VALIDATION_ERROR');

        let body: PasscodeRequest = _req.body;

        // Check that the email domain is allowed
        if(process.env.ALLOWED_EMAIL_DOMAINS)
        {
          let allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS.split(", ");

          if(allowedDomains.length > 0)
          {
            let receivedDomain = body.email.split("@")[1].split('.')[0];

            // Do the check if list is not empty
            if(!allowedDomains.some((domain) => domain == receivedDomain))
            {
              res.status(401).send();
              return;
            }
          }
        }

        // Generate a temporary response token and store it for 10 minutes
        let passcode: number = AuthService.getInstance().generateLoginPasscode(body.email);

        // Send the token through email
        let transporter = nodemailer.createTransport({
          host: process.env.NODEMAILER_HOST,
          port: process.env.NODEMAILER_PORT,
          secure: process.env.NODEMAILER_SECURE,
          service: process.env.NODEMAILER_SERVICE,
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
          },
          tls: {
            rejectUnauthorized: process.env.NODEMAILER_TLS_REJECTUNAUTHORIZED,
          },
        }as SMTPTransport.Options);

        let mailOptions: any;

        if(process.env.ENABLE_EMAIL_SENDING == 'false')
        {
          mailOptions = {
            from: 'UOC Testing Platform',
            to: body.email,
            subject: 'Login passcode',
            text: 'Your passcode: ' + passcode
          };

          console.log('----> MAIL TO SEND: ', mailOptions)
        }

        else
        {
          mailOptions = {
            from: 'UOC Testing Platform',
            to: body.email,
            subject: 'Login passcode',
            html: generateEmailTemplate(body.email, passcode)
          };

          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log('Error: ', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
        }

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
        if(!AuthService.getInstance().validatePasscode(body.email, Number(body.passcode))) 
        {
          res.status(401).send();
          return;
        }

        else
        {
          // Generate JWT
          let token = jwt.sign({
            email: body.email
          }, process.env.BEARER_TOKEN_SECRET!, { expiresIn: environment.auth.jwtExpiration * 60 });

          // Check if user exists on the system. If not, front should ask user for basic data.
          let userDAO = new UserDAO();
          let missingUserData = false; 

          let user: User;
          userDAO.getByEmail(body.email)
          .then((res) => {
            user = res;
          })
          .catch(async (err) => {
              let userRequest: User = new User(0, '', '', body.email, 2);

              // Add user to the DB
              user = await userDAO.create(userRequest);

              missingUserData = true;
          })
          .finally(() => {
            if((user as User).name == '' || (user as User).surnames == '') missingUserData = true;

            return res.send({jwt: token, 
              name: user.name, 
              surnames: user.surnames, 
              role: user.userRole, 
              missingUserData: missingUserData});            
          });
        }
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }

  export const loginCheck = async (_req: express.Request, res: express.Response) => {
    try {
      let userEmail: string = '';
      if(_req.headers['user'] as string) userEmail = _req.headers['user'] as string;

      let users = new UserDAO();

      try
      {
        let user = await users.getByEmail(userEmail);
        return res.send({
          email: user.email,
          name: user.name, 
          surnames: user.surnames, 
          role: user.userRole
        });
      } catch(err) {
        return res.status(401).send();
      }
    }
    catch(err: any) {
        let error: CustomHTTPError = parseErrorCode(err);
        res.status(error.status).send(error.message);
    }
  }