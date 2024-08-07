import { ClassroomDAO } from '@models/classroomDAO';
import express from 'express';

export const classrooms = async (_req: express.Request, res: express.Response) => {
  try {
    if(_req.method == 'GET')
    {
      let classrooms = await new ClassroomDAO().getAll();
      res.send(classrooms);
    }
  }
  catch(err: any) {
    console.log(err)
  }
}