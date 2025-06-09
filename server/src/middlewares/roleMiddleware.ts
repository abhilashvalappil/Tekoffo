import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  role?: string | string[];  
}
export const authorizeRole = (allowedRoles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.role;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    const hasAccess = Array.isArray(userRole)
      ? userRole.some(role => rolesArray.includes(role))
      : rolesArray.includes(userRole || "");

    if (!hasAccess) {
      res.status(403).json({ message: 'Forbidden: Access denied' });
      return;
    }

    next();
  };
};

