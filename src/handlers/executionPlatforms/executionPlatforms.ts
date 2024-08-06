import { ExecutionPlatformDAO } from '@models/executionPlatform/executionPlatformDAO';
import express from 'express';

export const executionPlatforms = async (_req: express.Request, res: express.Response) => {
    let executionPlatform = await new ExecutionPlatformDAO().get(1);
    console.log('Object: ', executionPlatform);
    console.log('ID: ', executionPlatform.id);
    console.log('name: ', executionPlatform.name);
  }