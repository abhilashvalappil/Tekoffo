import API from '../services/api'
import { adminENDPOINTS } from '../constants/endpointUrl'
import { FetchUserResponse, User, Category, fetchedCategories } from '../types/admin'

export const fetchUsers = async(): Promise<FetchUserResponse> => {
    try {
        const response = await API.get<{ data: { users: User[]; totalCount: number } }>(adminENDPOINTS.GET_USERS)
        const {data}= response.data;
        return{
            users:data.users,
            totalCount:data.totalCount
        }
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong while fetching!';
        throw new Error(errorMessage);
    }
}

export const updateUserStatus = async(userId: string, isBlocked: boolean): Promise<{ userId: string; isBlocked: boolean }> => {
    try {
        const response = await API.post(adminENDPOINTS.UPDATE_USER,{userId,isBlocked})
        return {userId, isBlocked:response.data.user.isBlocked}
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong while updating user status!';
        throw new Error(errorMessage);
    }
}

export const addCategory = async(categoryData:Partial<Category>) => {
    try {
        console.log('conseol from addddddddd',categoryData)
        const result = await API.post(adminENDPOINTS.ADD_CATEGORY,{categoryData})
        return result.data;
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong while adding category!';
        throw new Error(errorMessage);
    }
}

export const updateCategory = async(categoryData:Partial<Category>) => {
    try {
        const response = await API.put(adminENDPOINTS.UPDATE_CATEGORY,categoryData)
        console.log('conosle from updatecategoryyyyy',response.data)
        return response.data;
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Failed to update category';
        throw new Error(errorMessage);
    }
}


// export const fetchCategories = async(): Promise<fetchedCategories[]> => {
//     try {
//         const result = await API.get(adminENDPOINTS.GET_CATEGORIES)
//         return result.data.categories || [];
//     } catch (error: any) {
//         const errorMessage = error.response?.data?.error || 'Failed to fetch categoriesa';
//         throw new Error(errorMessage);
//     }
// }
export const fetchCategories = async (page = 1, limit = 8): Promise<{
    data: fetchedCategories[],
    meta: { total: number, page: number, pages: number, limit: number }
  }> => {
    try {
      const result = await API.get(adminENDPOINTS.GET_CATEGORIES, {
        params: { page, limit },
      });
  
      return result.data;
  
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  };
  

export const updateCategoryStatus = async(categoryId:string, isListed:boolean): Promise<{ _id: string, catId: string; isListed: boolean }> => {
    try {
        const response = await API.put(adminENDPOINTS.UPDATE_CATEGORY_STATUS,{categoryId,isListed})
        const updatedCategory = response.data.category;
        console.log('console from admin.tsss updatecategorystaus',updatedCategory)
        return {
            _id: updatedCategory._id,
            catId: updatedCategory.catId, 
            isListed: updatedCategory.isListed,
          };
    } catch (error:any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong while updating category statussss!';
        throw new Error(errorMessage);
    }

}