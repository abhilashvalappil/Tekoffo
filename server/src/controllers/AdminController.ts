import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import { MESSAGES } from '../constants/messages';
import { IAdminService } from "../interfaces";
import { error } from "console";

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
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

            const result = await this.adminService.fetchUsers(userId);
            res.status(Http_Status.OK).json({
                success:true,
                message:MESSAGES.USERS_FETCHED,
                data:result
            })
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
            const {catId, name, subCategories} = req.body.categoryData;
            if(!catId || !name){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            }
            const result = await this.adminService.addCategory(catId,name,subCategories)
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
            // console.log('console from admincontroller.ts',req.body)
            const {_id: id, catId, name, subCategories} = req.body;
            if(!id || !name){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            }

            const message = await this.adminService.updateCategory(id,catId,name.trim(),subCategories)
            res.status(Http_Status.CREATED).json(message)
        } catch (error) {
            next(error);
        }
    }

    // async getCategories(req:Request, res:Response): Promise<void> {
    //     try {
    //         const {categories} = await this.adminService.fetchCategories();
    //         res.status(Http_Status.OK).json({success: true, categories})
    //     } catch (error) {
    //         ErrorHandler.handleError(error, res);
    //     }
    // }
    async getCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            if(!userId){
                res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.UNAUTHORIZED})
                return;
            }

          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 8;
      
          const paginatedResponse = await this.adminService.fetchCategories(userId,page, limit);
      
          res.status(Http_Status.OK).json({ success: true, ...paginatedResponse });
        } catch (error) {
            next(error);
        }
      }
      

    async updateCategoryStatus(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {categoryId, isListed} = req.body;
            // if(!categoryId || !isListed){
            //     res.status(Http_Status.BAD_REQUEST).json({error:MESSAGES.MISSING_CREDENTIALS})
            // }
            if (!categoryId || typeof isListed !== 'boolean') {
                console.log('console from admincontrolllll - Validation failed');
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
}