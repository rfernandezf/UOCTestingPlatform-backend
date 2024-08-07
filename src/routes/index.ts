import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';
import { classrooms } from '@handlers/classrooms/classrooms';
import { deletePlatforms, getPlatforms, getSinglePlatform, postPlatforms, putPlatform } from '@handlers/platforms/platforms';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);
router.get('/classrooms', classrooms);

router.get('/platforms', getPlatforms);
router.post('/platforms', postPlatforms);
router.get('/platforms/:id', getSinglePlatform);
router.put('/platforms/:id', putPlatform);
router.delete('/platforms/:id', deletePlatforms);

export default router;
