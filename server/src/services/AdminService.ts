
import {IUserResponse,IAdminService,IUserRepository,ICategoryRepository,ICategory } from '../interfaces';
import { MESSAGES } from '../constants/messages';
import { CustomError,ValidationError,ConflictError,NotFoundError,UnauthorizedError } from "../errors/customErrors";

 

export class AdminService implements IAdminService {
    private userRepository: IUserRepository;
    private categoryRepository: ICategoryRepository;
    
 
   constructor(userRepository: IUserRepository, categoryRepository: ICategoryRepository ){
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

        async fetchUsers(userId:string): Promise<{users:  IUserResponse[]; totalCount: number}> {
           
                const user = await this.userRepository.findUserById(userId);
                if (!user) {
                    throw new NotFoundError(MESSAGES.INVALID_USER);
                }

                const users = await this.userRepository.findUsers();
                if(!users){
                    throw new NotFoundError(MESSAGES.NO_USERS_FOUND)
                }
                return {
                    users: users.map(user => ({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isBlocked: user.isBlocked,
                    })),
                    totalCount: users.length
                };         
        }

        async updateUserStatus(userId:string, isBlocked: boolean): Promise<{message:string; user: any}> {
                const user = await this.userRepository.findUserById(userId);
                if(!user){
                    throw new NotFoundError(MESSAGES.NO_USERS_FOUND)
                }
                const updatedUser = await this.userRepository.updateUserStatus(userId, isBlocked);
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

        async addCategory(catId:string,name:string,subCategories?:string[]): Promise<{message:string}> {

                // console.log('console from adcategoryyyyyyyyyy',)
                const categoryExist = await this.categoryRepository.findCategory(name)
                if(categoryExist){
                    throw new ConflictError(MESSAGES.CATEGORY_ALREADY_EXISTS)
                }

                if (subCategories && subCategories.length > 0) {
                const subCategoryExist = await this.categoryRepository.findSubCategoriesMatch(subCategories);
                if(subCategoryExist){
                    throw new ConflictError(MESSAGES.SUBCATEGORY_ALREADY_EXISTS)
                }
            }
                
                const result = await this.categoryRepository.createCategory({catId,name,subCategories})
                return{message:MESSAGES.CATEGORY_CREATED_SUCCESSFULLY}
        }

        async updateCategory(id:string, catId:string,name:string,subCategories?:string[]): Promise<{message:string}> {
                console.log('console from adminservice updatecateegory',id,catId,name,subCategories)
                const CategoryExist = await this.categoryRepository.findCategoryById(id);
                if(!CategoryExist){
                    throw new NotFoundError(MESSAGES.CATEGORY_NOT_FOUND)
                }

                const existingCategory = await this.categoryRepository.checkCategoryExistsExcludingId(id, name);
                if (existingCategory) {
                throw new ConflictError(MESSAGES.CATEGORY_ALREADY_EXISTS);
                }

                if (subCategories && subCategories.length > 0) {
                const subCategoryExist = await this.categoryRepository.SubCategoriesMatch(subCategories, id);
                if(subCategoryExist){
                    throw new ConflictError(MESSAGES.SUBCATEGORY_ALREADY_EXISTS)
                    }
                }

                await this.categoryRepository.updateCategory({_id: id, name,subCategories})
                return{message:MESSAGES.CATEGORY_UPDATED_SUCCESSFULLY}
        }

        // async fetchCategories(): Promise<{categories: ICategory[]}> {
        //     try {
        //       const categories = await this.categoryRepository.getAllCategories();
        //       return {categories};
              
        //     } catch (error: any) {
        //       throw new CustomError(`Failed to fetch categoriesss: ${error.message}`);
        //     }
        //   }
        async fetchCategories(userId:string,page = 1, limit = 8) {

                const user = await this.userRepository.findUserById(userId)
             
                if(!user){
                    throw new NotFoundError(MESSAGES.INVALID_USER)
                }

              const skip = (page - 1) * limit;
              const categories = await this.categoryRepository.getAllCategories(skip, limit);
          
              // Count total categories (for pagination)
              const total = await this.categoryRepository.countCategories();
          
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
                if(!categoryExist){
                    throw new NotFoundError(MESSAGES.CATEGORY_NOT_FOUND)
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

    }