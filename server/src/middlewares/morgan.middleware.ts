import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';

const logFormat = '[:date[iso]] ":method :url" :status :res[content-length] - :response-time ms';

let morganMiddleware: RequestHandler;

if (process.env.NODE_ENV === 'development') {
  morganMiddleware = morgan(logFormat);
} else {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
  
    //* Log to file in production
    const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), {
      flags: 'a',
    });
  
  morganMiddleware = morgan(logFormat, { stream: logStream });
}

export default morganMiddleware;
