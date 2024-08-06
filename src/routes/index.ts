import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';
import { classrooms } from '@handlers/classrooms/classrooms';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);
router.get('/classrooms', classrooms);

export default router;
