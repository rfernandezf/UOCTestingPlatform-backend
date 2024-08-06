import { ExecutionPlatform } from '@controllers/executionPlatform/executionPlatform';
import express from 'express';

export const runTest = async (_req: express.Request, res: express.Response) => {
    res.send('Running tests...');
    
    let executionPlatform: ExecutionPlatform = new ExecutionPlatform(0, "java");

    executionPlatform.run();
  }