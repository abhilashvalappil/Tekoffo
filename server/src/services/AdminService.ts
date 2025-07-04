
import { IAdminService,IUserRepository,ICategoryRepository,ICategory, IJobRepository, IPlatformRepository, IContractRepository, ITransactionRepository, ITransactionWithUsername, UserPublicInfo, User } from '../interfaces';
import { MESSAGES } from '../constants/messages';
import { ConflictError,NotFoundError } from "../errors/customErrors";
import { onlineUsers } from '../utils/socketManager';
import { getIO } from '../config/socket';
import { PaginatedResponse } from '../types/commonTypes';
 

export class AdminService implements IAdminService {
    private userRepository: IUserRepository;
    private categoryRepository: ICategoryRepository;
    private jobRepository: IJobRepository;
    private platformRepository: IPlatformRepository;
    private contractRepository: IContractRepository;
    private transactionRepository: ITransactionRepository;

    
 
   constructor(userRepository: IUserRepository, categoryRepository: ICategoryRepository, jobRepository: IJobRepository, platformRepository: IPlatformRepository, contractRepository: IContractRepository, transactionRepository: ITransactionRepository){
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.jobRepository = jobRepository;
        this.platformRepository = platformRepository;
        this.contractRepository = contractRepository;
        this.transactionRepository = transactionRepository;
    }

        async fetchUsers(userId:string, page: number, limit: number,search?:string): Promise<PaginatedResponse<User>> {
            
            const user = await this.userRepository.findUserById(userId);
            if (!user) {
                throw new NotFoundError(MESSAGES.INVALID_USER);
            }
            
            const skip = (page - 1) * limit;
            const [users,total] = await Promise.all([
                this.userRepository.findUsers(skip, limit, search),
                this.userRepository.countUsers(search)
            ])

            if(!users){
                throw new NotFoundError(MESSAGES.NO_USERS_FOUND)
            }
            return {
                  data: users.map(user => ({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                })),
                meta: {
                    total: total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit,
                },
            };         
        }

        async getTotalUsersCountByRole(userId:string): Promise<{clientsCount:number,freelancersCount:number}> {
            const user = await this.userRepository.findUserById(userId);
            if(!user){
                throw new NotFoundError(MESSAGES.NO_USERS_FOUND)
            }
            const clientsCount = await this.userRepository.getTotalClientsCount()
            const freelancersCount = await this.userRepository.getTotalFreelancersCount()
            return{clientsCount,freelancersCount}
        }

        async updateUserStatus(userId:string, isBlocked: boolean): Promise<{message:string; user: UserPublicInfo}> {
                const user = await this.userRepository.findUserById(userId);
                if(!user){
                    throw new NotFoundError(MESSAGES.NO_USERS_FOUND)
                }
                const updatedUser = await this.userRepository.updateUserStatus(userId, isBlocked);
                if (isBlocked) {
                    const socketId = onlineUsers.get(userId);
                    if (socketId) {
                        const io = getIO();
                        io.to(socketId).emit("user:blocked");
                    }
                }
                return {
                    message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
                    user:{
                        _id:updatedUser?._id,
                        username: updatedUser?.username,
                        email: updatedUser?.email,
                        role:updatedUser?.role,
                        isBlocked:updatedUser?.isBlocked
                    }
                  };
        }

        async addCategory(name:string,subCategories:string[]): Promise<{message:string}> {

                const categoryExist = await this.categoryRepository.findCategory(name)
                if(categoryExist){
                    throw new ConflictError(MESSAGES.CATEGORY_ALREADY_EXISTS)
                }

                if (subCategories && subCategories.length > 0) {
                const subCategoryExist = await this.categoryRepository.findSubCategoriesMatch(subCategories);
                if (subCategoryExist) {
                  throw new ConflictError(MESSAGES.SUBCATEGORY_ALREADY_EXISTS);
                }
            }
            
                 await this.categoryRepository.createCategory({name,subCategories})
                return{message:MESSAGES.CATEGORY_CREATED_SUCCESSFULLY}
            }

        async updateCategory(id:string,name:string,subCategories:string[]): Promise<{message:string}> {
                const CategoryExist = await this.categoryRepository.findCategoryById(id);
                if(!CategoryExist){
                    throw new NotFoundError(MESSAGES.CATEGORY_NOT_FOUND)
                }

                const categoryNameExist = await this.categoryRepository.checkCategoryExistsExcludingId(id, name);
                if (categoryNameExist) {
                throw new ConflictError(MESSAGES.CATEGORY_ALREADY_EXISTS);
                }

                if (subCategories && subCategories.length > 0) {
                const subCategoryExist = await this.categoryRepository.SubCategoriesMatch(subCategories, id);
                if (subCategoryExist) {
                  throw new ConflictError(MESSAGES.SUBCATEGORY_ALREADY_EXISTS);
                }
              }

                await this.categoryRepository.updateCategory({_id: id, name,subCategories})
                return{message:MESSAGES.CATEGORY_UPDATED_SUCCESSFULLY}
        }

        async fetchCategories(userId:string, page: number, limit: number,search?:string): Promise<PaginatedResponse<ICategory>> {
            const user = await this.userRepository.findUserById(userId);
            if (!user) {
                throw new NotFoundError(MESSAGES.INVALID_USER);
            }

            const skip = (page - 1) * limit;
            const [categories, total] = await Promise.all([
                this.categoryRepository.getAllCategories(skip, limit, search),
                this.categoryRepository.countCategories(search),
            ]);
        
            return {
            data: categories,
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
            };
        }
          

        async updateCategoryStatus(categoryId:string, isListed:boolean): Promise<{message:string, category: Partial<ICategory>}> {
        
            const categoryExist = await this.categoryRepository.findCategoryById(categoryId);
            if (!categoryExist) {
              throw new NotFoundError(MESSAGES.CATEGORY_NOT_FOUND);
            }
            const updateCategory = await this.categoryRepository.updateCategoryStatus(categoryId, isListed)
            if(!updateCategory){
                throw new NotFoundError(MESSAGES.CATEGORY_STATUS_UPDATE_FAILED)
            }
            return {
                message: `Category ${isListed ? 'listed' : 'unListed'} successfully`,
                category:{
                    _id: updateCategory._id,
                    catId: updateCategory.catId,
                    isListed: updateCategory.isListed
                }
            }
        }

        async getActiveJobsCount(): Promise<{count:number}>{
            const count = await this.jobRepository.findActiveJobsCount()
            return{count}
        }

        async getPlatformRevenue(): Promise<{totalRevenue:number}> {
            const totalRevenue = await this.platformRepository.findTotalRevenue()
            return{totalRevenue}
        }

        async getPlatformEarnings(): Promise<{ month: string, earnings: number }[]> {
            return await this.platformRepository.findTotalEarningsGroupedByMonth();
        }

        async getEscrowFunds(): Promise<number>{
            return await this.contractRepository.getEscrowFunds()
        }

        async getAllTransactions(): Promise< ITransactionWithUsername[]>{
            return await this.transactionRepository.findAllTransactions()
        }

    }