

import express, { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index'

interface AuthRequest extends Request {
  userId?: string;
  role?: string;
  email?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    console.log('No token found in cookies');
    res.status(401).json({ message: 'No access token provided' });
    // return;  
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET ) as { id: string; role: string; email: string };
    req.userId = decoded.id;
    req.role = decoded.role;
    req.email = decoded.email;
    next();
  } catch (error:any) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;  
  }
};

export default authMiddleware;