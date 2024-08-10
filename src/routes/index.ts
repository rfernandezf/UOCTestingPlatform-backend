import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';
import { deletePlatform, getPlatforms, getSinglePlatform, postPlatform, putPlatform } from '@handlers/platforms/platforms';
import { deleteUser, deleteUserFromClassroom, getClassroomsInUser, getSingleUser, getUsers, postUser, postUserToClassroom, putUser } from '@handlers/users/users';
import { deleteClassroom, getClassrooms, getSingleClassroom, postClassroom, putClassroom } from '@handlers/classrooms/classrooms';
import { deleteAssessment, getAssessments, getSingleAssessment, postAssessment, putAssessment } from '@handlers/assessments/assessments';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);

router.get('/platforms', getPlatforms);
router.post('/platforms', postPlatform);
router.get('/platforms/:id', getSinglePlatform);
router.put('/platforms/:id', putPlatform);
router.delete('/platforms/:id', deletePlatform);

router.get('/users', getUsers);
router.post('/users', postUser);
router.get('/users/:id', getSingleUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.get('/users/:id/classrooms', getClassroomsInUser);
router.post('/users/:id_user/classrooms/:id_classroom', postUserToClassroom);
router.delete('/users/:id_user/classrooms/:id_classroom', deleteUserFromClassroom);

router.get('/classrooms', getClassrooms);
router.post('/classrooms', postClassroom);
router.get('/classrooms/:id', getSingleClassroom);
router.put('/classrooms/:id', putClassroom);
router.delete('/classrooms/:id', deleteClassroom);

router.get('/assessments', getAssessments);
router.post('/assessments', postAssessment);
router.get('/assessments/:id', getSingleAssessment);
router.put('/assessments/:id', putAssessment);
router.delete('/assessments/:id', deleteAssessment);

export default router;
