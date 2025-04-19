import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminService } from "../services/AdminService";
import authMiddleware from "../middlewares/authMiddleware";
import UserRepository from "../repositories/UserRepository";
import CategoryRepository from "../repositories/CategoryRepository";
 

const adminRouter = Router();
 
const adminService = new AdminService(UserRepository,CategoryRepository); 
const adminController = new AdminController(adminService);

adminRouter.get('/users',authMiddleware,adminController.fetchUsers.bind(adminController));
adminRouter.post('/update-status',adminController.updateUserStatus.bind(adminController));
adminRouter.post('/add-category',adminController.addCategory.bind(adminController));
adminRouter.put('/update-category',adminController.updaCategory.bind(adminController));
adminRouter.get('/get-categories',authMiddleware,adminController.getCategories.bind(adminController));
adminRouter.put('/update-category-status',adminController.updateCategoryStatus.bind(adminController));

export default adminRouter;