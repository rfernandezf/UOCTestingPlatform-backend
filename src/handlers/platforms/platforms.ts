import { ExecutionPlatformDAO } from '@models/executionPlatformDAO';
import express from 'express';

export const platforms = async (_req: express.Request, res: express.Response) => {
    try {
      if(_req.method == 'GET')
      {
        let executionPlatforms = await new ExecutionPlatformDAO().getAll();
        res.send(executionPlatforms);
      }
    }
    catch(err: any) {
      console.log(err)
    }
  }