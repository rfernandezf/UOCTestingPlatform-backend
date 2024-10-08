import createError from 'http-errors';
import express, { NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as https from 'https';
import * as fs from "fs";
dotenv.config({ path: path.join(__dirname, '../.env') });

import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';
import router from './routes/index';
import { environment } from '@utils/environment';
import { SSEConnectionHandler } from './services/sseConnection';
import Logger from '@utils/logger';
var cors = require('cors');
export const app: express.Application = express();

const CERT_PATH = path.join(process.env.COMMON_FOLDER!, environment.folders.certs, process.env.CERT_NAME!);
const KEY_PATH = path.join(process.env.COMMON_FOLDER!, environment.folders.certs, process.env.PRIVATE_KEY_NAME!);

app.use(httpLogger);
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/', router);


app.get('/api/v1/sse', SSEConnectionHandler.getInstance().createConnection());

// Catch 404 and forward to error handler
app.use((_err: Error, _req: express.Request, _res: express.Response, next: NextFunction) => {
  if(_err) return _res.status(400).send({ status: 400, message: _err.message });

  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res, next) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || '8080';
app.set('port', port);

const httpsOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
};

export const server = https.createServer(httpsOptions, app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
  Logger.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);