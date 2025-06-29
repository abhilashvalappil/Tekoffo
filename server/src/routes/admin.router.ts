import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminService } from "../services/AdminService";
import authMiddleware from "../middlewares/authMiddleware";
import UserRepository from "../repositories/UserRepository";
import CategoryRepository from "../repositories/CategoryRepository";
import JobRepository from "../repositories/JobRepository";
import PlatformRepository from "../repositories/PlatformRepository";
import ContractRepository from "../repositories/ContractRepository";
import TransactionRepository from "../repositories/TransactionRepository";
 

const adminRouter = Router();
 
const adminService = new AdminService(UserRepository,CategoryRepository, JobRepository, PlatformRepository, ContractRepository, TransactionRepository); 
const adminController = new AdminController(adminService);

adminRouter.get('/users',authMiddleware,adminController.fetchUsers.bind(adminController));
adminRouter.get('/users/count',authMiddleware,adminController.getTotalUsersCountByRole.bind(adminController));
adminRouter.post('/update-status',adminController.updateUserStatus.bind(adminController));
adminRouter.post('/add-category',adminController.addCategory.bind(adminController));
adminRouter.put('/update-category',adminController.updaCategory.bind(adminController));
adminRouter.get('/get-categories',authMiddleware,adminController.getCategories.bind(adminController));
adminRouter.put('/update-category-status',adminController.updateCategoryStatus.bind(adminController));
adminRouter.get('/api/active-jobs',adminController.getActiveJobsCount.bind(adminController));
adminRouter.get('/total-revenue',adminController.getPlatformRevenue.bind(adminController));
adminRouter.get('/total-earnings',adminController.getPlatformEarnings.bind(adminController));
adminRouter.get('/escrow-funds',adminController.getEscrowFunds.bind(adminController));
adminRouter.get('/api/transactions',adminController.getAllTransactions.bind(adminController));

export default adminRouter;