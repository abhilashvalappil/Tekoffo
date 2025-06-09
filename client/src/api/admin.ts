import API from '../services/api'
import { adminENDPOINTS } from '../constants/endpointUrl'
import { FetchUserResponse, fetchedCategories, AddCategoryPayload, EditCategoryPayload } from '../types/admin'
import { handleApiError } from '../utils/errors/errorHandler'
import { TransactionWithUsername } from '../types/transaction'

export const fetchUsers = async(page = 1, limit = 3): Promise<{
    data:FetchUserResponse,
    meta: { total: number, page: number, pages: number, limit: number }
}> => {
    try {
        const response = await API.get(
            adminENDPOINTS.GET_USERS,
            { params: { page, limit } }
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const updateUserStatus = async(userId: string, isBlocked: boolean): Promise<{ userId: string; isBlocked: boolean }> => {
    try {
        const response = await API.post(adminENDPOINTS.UPDATE_USER,{userId,isBlocked})
        return {userId, isBlocked:response.data.user.isBlocked}
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const addCategory = async(categoryData:Partial<AddCategoryPayload>) => {
    try {
        const result = await API.post(adminENDPOINTS.ADD_CATEGORY,{categoryData})
        return result.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const updateCategory = async(categoryData:Partial<EditCategoryPayload>) => {
    try {
        console.log('the edittt category datas aree',categoryData)
        const response = await API.put(adminENDPOINTS.UPDATE_CATEGORY,categoryData)
        console.log('conosle from updatecategoryyyyy',response.data)
        return response.data;
    } catch (error) {
        console.log('the edittcategory error is :',error)
        throw new Error(handleApiError(error));
    }
}

export const fetchCategories = async (page = 1, limit = 8): Promise<{
    data: fetchedCategories[],
    meta: { total: number, page: number, pages: number, limit: number }
  }> => {
    try {
      const result = await API.get(adminENDPOINTS.GET_CATEGORIES, {
        params: { page, limit },
      });
      return result.data;
    } catch (error) {
        throw new Error(handleApiError(error));
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
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchTotalActiveJobsCount = async() : Promise<number> => {
    try {
        const response = await API.get(adminENDPOINTS.GET_ACTIVEJOBS_COUNT)
        return response.data.count;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchPlatformRevenue = async(): Promise<number> => {
    try {
        const response = await API.get(adminENDPOINTS.GET_TOTAL_REVENUE)
        return response.data.totalRevenue;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchMonthlyRevenueStats = async(): Promise<{ month: string; earnings: number }[]> => {
    try {
        const response = await API.get('/admin/total-earnings')
        return response.data.data;
    } catch (error) {
         throw new Error(handleApiError(error));
    }
}

export const fetchEscrowFunds = async(): Promise<number> => {
    try {
        const response = await API.get(adminENDPOINTS.GET_TOTAL_ESCROW_FUNDS)
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export const fetchAllTransactions = async(): Promise<TransactionWithUsername[]> => {
    try {
        const response = await API.get(adminENDPOINTS.GET_ALL_TRANSACTIONS)
        console.log('console from fetchTransactions * ==== *',response.data.transactions)
        return response.data.transactions;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

