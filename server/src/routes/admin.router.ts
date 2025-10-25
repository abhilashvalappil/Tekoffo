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
adminRouter.post('/categories',adminController.addCategory.bind(adminController));
adminRouter.put('/categories',adminController.updaCategory.bind(adminController));
adminRouter.get('/categories',authMiddleware,adminController.getCategories.bind(adminController));
adminRouter.put('/categories/status',adminController.updateCategoryStatus.bind(adminController));
adminRouter.get('/activejobs',adminController.getActiveJobsCount.bind(adminController));
adminRouter.get('/revenue',adminController.getPlatformRevenue.bind(adminController));
adminRouter.get('/earnings',adminController.getPlatformEarnings.bind(adminController));
adminRouter.get('/escrow-funds',adminController.getEscrowFunds.bind(adminController));
adminRouter.get('/transactions',adminController.getAllTransactions.bind(adminController));

export default adminRouter;