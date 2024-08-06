import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';
import { classrooms } from '@handlers/classrooms/classrooms';
import { executionPlatforms } from '@handlers/executionPlatforms/executionPlatforms';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);
router.get('/classrooms', classrooms);
router.get('/platforms', executionPlatforms);

export default router;
