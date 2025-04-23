import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repositories/UserRepository';  

interface AuthRequest extends Request {
  userId?: string;
}

const checkBlockedStatus = async (req: AuthRequest, res: Response, next: NextFunction) : Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized access' });
    return;
  }

  try {
    const user = await UserRepository.findUserById(userId);  

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ message: 'Your account has been blocked by the admin' });
      return;
    }

    next();
  } catch (error) {
    console.error('Error checking account status:', error);
    res.status(500).json({ message: 'Server error while checking account status' });
    return;
  }
};

export default checkBlockedStatus;
