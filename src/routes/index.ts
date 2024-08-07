import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';
import { classrooms } from '@handlers/classrooms/classrooms';
import { platforms } from '@handlers/platforms/platforms';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);
router.get('/classrooms', classrooms);
router.get('/platforms', platforms);

export default router;
