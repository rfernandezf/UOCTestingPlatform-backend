import express from 'express';
import jwt from 'jsonwebtoken';
import { msEpochToDate } from '@utils/dbUtils';
import { UserDAO } from '@models/userDAO';
import { UserRole } from '@interfaces/user';
import { CustomHTTPError, parseErrorCode } from '@utils/restUtils';

export const authenticateToken=(_req: express.Request, res: express.Response, next: any)=> {

    if(process.env.RUNNING_TEST_SCENARIOS == 'true') 
    {
        _req.headers['user'] = 'test@test.com';
        next();
    }

    else
    {
        var authHeader=_req.headers['authorization'];
        var token=authHeader && authHeader.split(' ')[1];
        
        if(token==null) return res.sendStatus(401);

        jwt.verify(token, process.env.BEARER_TOKEN_SECRET!, async (err, data: any)=>{
            if(err) return res.sendStatus(401);

            // Check token expiration date
            if(msEpochToDate(data.exp) <= new Date()) return res.sendStatus(401);
            
            // Store user inside the request
            _req.headers['user'] = data.email;

            next();
        });
    }
  }

export const userRoleTeacher=async (_req: express.Request, res: express.Response, next: any)=> {

    let userEmail: string = '';
    if(_req.headers['user'] as string) userEmail = _req.headers['user'] as string;

    let users = new UserDAO();
    let user = await users.getByEmail(userEmail);

    if(user.userRole == UserRole.STUDENT) 
    {
        let error: CustomHTTPError = parseErrorCode(new Error("UNAUTHORIZED"));
        res.status(error.status).send(error.message);
    }

    else next();
}