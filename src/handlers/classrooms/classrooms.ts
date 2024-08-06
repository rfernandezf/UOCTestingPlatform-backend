import { ClassroomDAO } from '@models/classroom/classroomDAO';
import express from 'express';

export const classrooms = async (_req: express.Request, res: express.Response) => {
    let classroom = await new ClassroomDAO().get(1);
    console.log('Object: ', classroom);
    console.log('ID: ', classroom.id);
    console.log('name: ', classroom.name);
    console.log('description: ', classroom.description);
    console.log('assessment: ', classroom.assessment);
  }