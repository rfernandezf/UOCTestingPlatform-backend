import express from 'express';
import { healthCheck } from '../handlers/healthcheckHandler';
import { deletePlatform, getPlatforms, getPlatformScript, getSinglePlatform, postPlatform, putPlatform, putPlatformScript } from '@handlers/platformsHandler';
import { deleteUser, deleteUserFromClassroom, getClassroomsInUser, getSingleUser, getUsers, postUser, postUserToClassroom, putUser } from '@handlers/usersHandler';
import { deleteClassroom, getClassrooms, getSingleClassroom, postClassroom, putClassroom } from '@handlers/classroomsHandler';
import { deleteAssessment, deleteAssessmentFiles, getAssessments, getSingleAssessment, postAssessment, putAssessment, runAssessment, uploadAssessmentFiles } from '@handlers/assessmentsHandler';
import { getPasswordlessToken } from '@handlers/authHandler';
const multer = require('multer');

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);

router.get('/platforms', getPlatforms);
router.post('/platforms', postPlatform);
router.get('/platforms/:id', getSinglePlatform);
router.put('/platforms/:id', putPlatform);
router.delete('/platforms/:id', deletePlatform);
router.get('/platforms/:id/script', getPlatformScript);
router.put('/platforms/:id/script', putPlatformScript);

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
router.post('/assessments/:id/files', multer().single('file'), uploadAssessmentFiles);
router.delete('/assessments/:id/files', deleteAssessmentFiles);
router.post('/assessments/:id/run/:sseClientId', multer().single('file'), runAssessment);

router.post('/auth/emailToken', getPasswordlessToken);

export default router;
