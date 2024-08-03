import express from 'express';
import { healthCheck } from '../handlers/healthcheck';
import { runTest } from '../handlers/core/run';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);
router.get('/run', runTest);

export default router;
