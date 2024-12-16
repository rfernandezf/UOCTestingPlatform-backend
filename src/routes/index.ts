import express from 'express';
import { deletePlatform, getPlatforms, getPlatformScript, getSinglePlatform, postPlatform, putPlatform, putPlatformScript } from '@handlers/platformsHandler';
import { deleteUser, deleteUserFromClassroom, deleteUserFromClassroomJWT, getClassroomsInUser, getClassroomsInUserJWT, getSingleUser, getUsers, getUsersInClassroom, postUser, postUserToClassroom, postUserToClassroomJWT, putUser } from '@handlers/usersHandler';
import { deleteClassroom, getClassrooms, getSingleClassroom, postClassroom, putClassroom } from '@handlers/classroomsHandler';
import { deleteAssessment, deleteAssessmentFiles, getAssessmentsRunInfoByUser, getAssessments, getAssessmentsInClassroom, getSingleAssessment, postAssessment, putAssessment, runAssessment, uploadAssessmentFiles, getAssessmentRunInfo, downloadAssessmentFile, getAllAssessmentsLatestRunInfo, getAssessmentAllLatestRunInfo, getAssessmentsRunInfo, deleteAssessmentRunInfo } from '@handlers/assessmentsHandler';
import { loginCheck, requestJWTToken, requestPasscode } from '@handlers/authHandler';
import { authenticateToken, userRoleTeacher } from '@middlewares/authHeader';
const multer = require('multer');

const router = express.Router();

router.get('/platforms', authenticateToken, getPlatforms);
router.post('/platforms', authenticateToken, userRoleTeacher, postPlatform);
router.get('/platforms/:id', authenticateToken, getSinglePlatform);
router.put('/platforms/:id', authenticateToken, userRoleTeacher, putPlatform);
router.delete('/platforms/:id', authenticateToken, userRoleTeacher, deletePlatform);
router.get('/platforms/:id/script', authenticateToken, userRoleTeacher, getPlatformScript);
router.put('/platforms/:id/script', authenticateToken, userRoleTeacher, putPlatformScript);

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
router.delete('/users/:id', authenticateToken, userRoleTeacher, deleteUser);

router.get('/classrooms', authenticateToken, getClassrooms);
router.post('/classrooms', authenticateToken, userRoleTeacher, postClassroom);
router.get('/classrooms/:id', authenticateToken, getSingleClassroom);
router.put('/classrooms/:id', authenticateToken, userRoleTeacher, putClassroom);
router.delete('/classrooms/:id', authenticateToken, userRoleTeacher, deleteClassroom);
router.get('/classrooms/users/:id', authenticateToken, getUsersInClassroom);

router.get('/assessments', authenticateToken, getAssessments);
router.post('/assessments', authenticateToken, userRoleTeacher, postAssessment);
router.get('/assessments/run/latest', authenticateToken, getAllAssessmentsLatestRunInfo);
router.get('/assessments/:id', authenticateToken, getSingleAssessment);
router.get('/assessments/classrooms/:id_classroom', authenticateToken, getAssessmentsInClassroom);
router.put('/assessments/:id', authenticateToken, userRoleTeacher, putAssessment);
router.delete('/assessments/:id', authenticateToken, userRoleTeacher, deleteAssessment);
router.post('/assessments/:id/files', authenticateToken, userRoleTeacher, multer().single('file'), uploadAssessmentFiles);
router.delete('/assessments/:id/files', authenticateToken, userRoleTeacher, deleteAssessmentFiles);
router.get('/assessments/:id/run/', authenticateToken, getAssessmentsRunInfoByUser);
router.get('/assessments/:id/run/all', authenticateToken, userRoleTeacher, getAssessmentsRunInfo);
router.get('/assessments/:id/run/latest', authenticateToken, getAssessmentAllLatestRunInfo);
router.get('/assessments/run/:id', authenticateToken, getAssessmentRunInfo);
router.delete('/assessments/run/:id', authenticateToken, userRoleTeacher, deleteAssessmentRunInfo);
router.get('/assessments/run/:id/download', authenticateToken, downloadAssessmentFile);
router.post('/assessments/:id/run/:sseClientId', authenticateToken, multer().single('file'), runAssessment);

router.post('/auth/passcode', requestPasscode);
router.post('/auth/login', requestJWTToken);
router.get('/auth/check', authenticateToken, loginCheck);

export default router;
