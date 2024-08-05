import { Classroom } from '@controllers/classroom/classroom';
import { ExectionPlatform } from '@controllers/executionPlatform/executionPlatform';
import express from 'express';

export const runTest = async (_req: express.Request, res: express.Response) => {
    res.send('Running tests...');
    
    let executionPlatform: ExectionPlatform = new ExectionPlatform("java");

    executionPlatform.run();

    new Classroom();
  }