import express from 'express';
import { deletePlatform, getPlatforms, getPlatformScript, getSinglePlatform, postPlatform, putPlatform, putPlatformScript } from '@handlers/platformsHandler';
import { deleteUser, deleteUserFromClassroom, deleteUserFromClassroomJWT, getClassroomsInUser, getClassroomsInUserJWT, getSingleUser, getUsers, postUser, postUserToClassroom, postUserToClassroomJWT, putUser } from '@handlers/usersHandler';
import { deleteClassroom, getClassrooms, getSingleClassroom, postClassroom, putClassroom } from '@handlers/classroomsHandler';
import { deleteAssessment, deleteAssessmentFiles, getAssessments, getAssessmentsInClassroom, getSingleAssessment, postAssessment, putAssessment, runAssessment, uploadAssessmentFiles } from '@handlers/assessmentsHandler';
import { loginCheck, requestJWTToken, requestPasscode } from '@handlers/authHandler';
import { authenticateToken } from '@middlewares/authHeader';
const multer = require('multer');

const router = express.Router();

router.get('/platforms', authenticateToken, getPlatforms);
router.post('/platforms', authenticateToken, postPlatform);
router.get('/platforms/:id', authenticateToken, getSinglePlatform);
router.put('/platforms/:id', authenticateToken, putPlatform);
router.delete('/platforms/:id', authenticateToken, deletePlatform);
router.get('/platforms/:id/script', authenticateToken, getPlatformScript);
router.put('/platforms/:id/script', authenticateToken, putPlatformScript);

router.get('/users', authenticateToken, getUsers);
router.post('/users', authenticateToken, postUser);
// UserToClassroom based on JWT
router.get('/users/classrooms', authenticateToken, getClassroomsInUserJWT);
router.post('/users/classrooms/:id_classroom', authenticateToken, postUserToClassroomJWT);
router.delete('/users/classrooms/:id_classroom', authenticateToken, deleteUserFromClassroomJWT);
// UserToClassroom manual user IDs -deprecated-
router.get('/users/:id/classrooms', authenticateToken, getClassroomsInUser);
router.post('/users/:id_user/classrooms/:id_classroom', authenticateToken, postUserToClassroom);
router.delete('/users/:id_user/classrooms/:id_classroom', authenticateToken, deleteUserFromClassroom);
// Rest of users endpoints
router.get('/users/:id', authenticateToken, getSingleUser);
router.put('/users/:id', authenticateToken, putUser);
router.delete('/users/:id', authenticateToken, deleteUser);

router.get('/classrooms', authenticateToken, getClassrooms);
router.post('/classrooms', authenticateToken, postClassroom);
router.get('/classrooms/:id', authenticateToken, getSingleClassroom);
router.put('/classrooms/:id', authenticateToken, putClassroom);
router.delete('/classrooms/:id', authenticateToken, deleteClassroom);

router.get('/assessments', authenticateToken, getAssessments);
router.post('/assessments', authenticateToken, postAssessment);
router.get('/assessments/:id', authenticateToken, getSingleAssessment);
router.get('/assessments/classrooms/:id_classroom', authenticateToken, getAssessmentsInClassroom);
router.put('/assessments/:id', authenticateToken, putAssessment);
router.delete('/assessments/:id', authenticateToken, deleteAssessment);
router.post('/assessments/:id/files', authenticateToken, multer().single('file'), uploadAssessmentFiles);
router.delete('/assessments/:id/files', authenticateToken, deleteAssessmentFiles);
router.post('/assessments/:id/run/:sseClientId', authenticateToken, multer().single('file'), runAssessment);

router.post('/auth/passcode', requestPasscode);
router.post('/auth/login', requestJWTToken);
router.get('/auth/check', authenticateToken, loginCheck);

export default router;
