import { ClassroomDAO } from '@models/classroomDAO';
import express from 'express';

export const classrooms = async (_req: express.Request, res: express.Response) => {
  try {
    let classroom = await new ClassroomDAO().get(2)
    console.log('Object: ', classroom);
    console.log('ID: ', classroom.id);
    console.log('name: ', classroom.name);
    console.log('description: ', classroom.description);
  }
  catch(err: any) {
    console.log(err)
  }

  }