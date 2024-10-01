import express from 'express';
import jwt from 'jsonwebtoken';
import { epochToDate } from '@utils/dbUtils';

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
            if(epochToDate(data.exp) <= new Date()) return res.sendStatus(401);
            
            // Store user inside the request
            _req.headers['user'] = data.email;

            next();
        });
    }
  }