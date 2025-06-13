import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { IAdminService } from "../interfaces";

interface AuthRequest extends Request {
    userId?: string;  
  }

export class AdminController {
    private adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.adminService = adminService;
    }

    async fetchUsers(req:AuthRequest, res:Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 3;

            const paginatedResponse = await this.adminService.fetchUsers(userId,page,limit);
            res.status(Http_Status.OK).json(paginatedResponse)
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {userId, isBlocked } = req.body;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json(MESSAGES.INVALID_USER)
            }
            const result = await this.adminService.updateUserStatus(userId, isBlocked)
            res.status(Http_Status.OK).json({
                message:result.message,
                user:result.user
            })
        } catch (error) {
            next(error);
        }
    }

    async addCategory(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const { name, subCategories} = req.body.categoryData;
            if(!name || subCategories.length < 0){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            }
            const result = await this.adminService.addCategory(name,subCategories)
            res.status(Http_Status.CREATED).json({
                success:true,
                message:result.message
            })
        } catch (error) {
            next(error);
        }
    }

    async updaCategory(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {_id: id, name, subCategories} = req.body;
            if(!id || !name || !subCategories){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            }

            const message = await this.adminService.updateCategory(id,name.trim(),subCategories)
            res.status(Http_Status.CREATED).json(message)
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.FORBIDDEN).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 8;

          if (isNaN(page) || page < 1) {
              res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid page number" });
            }
          if (isNaN(limit) || limit < 1) {
              res.status(Http_Status.BAD_REQUEST).json({ error: "Invalid limit value" });
             }
      
          const paginatedResponse = await this.adminService.fetchCategories(userId,page, limit);
    
        res.status(Http_Status.OK).json(paginatedResponse);
        } catch (error) {
            next(error);
        }
      }
      

    async updateCategoryStatus(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {categoryId, isListed} = req.body;
            if (!categoryId || typeof isListed !== 'boolean') {
                res.status(Http_Status.BAD_REQUEST).json({ error: MESSAGES.MISSING_CREDENTIALS });
                return;
              }

            const result = await this.adminService.updateCategoryStatus(categoryId, isListed);
            res.status(Http_Status.OK).json({
                success:true,
                message:result.message,
                category:result.category
            })
        } catch (error) {
            next(error);
        }
    }

    async getActiveJobsCount(req:Request, res:Response, next: NextFunction): Promise<void>{
        try {
            const {count} = await this.adminService.getActiveJobsCount();
             res.status(Http_Status.OK).json({count})
        } catch (error) {
            next(error)
        }
    }

    async getPlatformRevenue(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {totalRevenue} = await this.adminService.getPlatformRevenue()
            res.status(Http_Status.OK).json({totalRevenue})
        } catch (error) {
            next(error);
        }
    }

    async getPlatformEarnings(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const earningsByMonth  = await this.adminService.getPlatformEarnings()
            res.status(Http_Status.OK).json({data: earningsByMonth})
        } catch (error) {
            next(error);
        }
    }

    async getEscrowFunds(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const totalEscrowFunds = await this.adminService.getEscrowFunds()
            res.status(Http_Status.OK).json({data: totalEscrowFunds})
        } catch (error) {
            next(error);
        }
    }

    async getAllTransactions(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const transactions = await this.adminService.getAllTransactions()
             res.status(Http_Status.OK).json({transactions})
        } catch (error) {
            next(error);
        }
    }
}