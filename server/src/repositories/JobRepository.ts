import { FilterQuery, Types } from 'mongoose';
import Job  from '../models/JobModel';  
import {  JobDataType, JobInputData } from '../interfaces/entities/IJob';
import { IJobRepository } from '../interfaces';
import BaseRepository from './BaseRepository';


class JobRepository extends BaseRepository<JobDataType> implements IJobRepository {
    constructor(){
        super(Job)
    }
    async createJobPost(clientId:string,job:Partial<JobInputData>): Promise<JobDataType> {
        const jobData = {
            ...job,
            clientId: new Types.ObjectId(clientId),
        };
        return await this.create(jobData)
    }

    async updateJob(id:string, job:Partial<JobDataType>): Promise<JobDataType | null> {
        return await this.updateById(id,{...job,updated_At: new Date()})
    }

    async findJobById(id:string): Promise<JobDataType | null>{
        return await this.findById(id)
    }

    async findJobsByClientId(clientId: string,skip: number, limit: number,search?: string,filters?: { status?: string; category?: string; subCategory?: string }): Promise<JobDataType[]> {
        const query: FilterQuery<JobDataType> = {
            clientId: new Types.ObjectId(clientId),
        };
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
            { title: searchRegex },
            { category: searchRegex },
            { subCategory: searchRegex },
            { description: searchRegex },
            ];
        }
         if (filters?.status) query.status = filters.status;
         if (filters?.category) query.category = filters.category;
         if (filters?.subCategory) query.subCategory = filters.subCategory;

         return await this.find(query, {
            skip,
            limit,
            sort: { createdAt: -1 },
        });
    }

    async countJobsByClientId(clientId:string,search?: string, filters?: { status?: string; category?: string; subCategory?: string }): Promise<number> { 
        const query: FilterQuery<JobDataType> = {
            clientId: new Types.ObjectId(clientId),
        };
         if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
            { title: searchRegex },
            { category: searchRegex },
            { subCategory: searchRegex },
            { description: searchRegex },
            ];
        }

        if (filters?.status) query.status = filters.status;
        if (filters?.category) query.category = filters.category;
        if (filters?.subCategory) query.subCategory = filters.subCategory;

        return await this.count(query);
      }

    async countJobs(): Promise<number> {
        return await this.count();   
      }

    async findActiveJobsCount(): Promise<number> {
        return await this.count({status:'open'})
    }

    async countFilteredJobs(search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<number> {
        const query: FilterQuery<JobDataType> = { isBlocked: false, status: 'open' };

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
            { title: regex },
            { description: regex },
            { category: regex },
            { subCategory: regex }
            ];
        }

        if (filters?.category) query.category = filters.category;
        if (filters?.subCategory) query.subCategory = filters.subCategory;

        if (filters?.budgetRange) {
            const [minStr, maxStr] = filters.budgetRange.split('-');
            const min = parseInt(minStr);
            const max = parseInt(maxStr);
            if (!isNaN(min) && !isNaN(max)) {
            query.budget = { $gte: min, $lte: max };
            }
        }

        return this.count(query);
    }


    async findActiveJobsCountByUserId(userId: string): Promise<number> {
        return await this.count({
            clientId: new Types.ObjectId(userId),
            status: { $in: ['open', 'inprogress'] }
        });
    }

    async findCompletedJobsCountByUserId(userId: string): Promise<number> {
        return await this.count({
            clientId: new Types.ObjectId(userId),
            status: 'completed'
        });
    }

    async findActiveJobPostsByUserId(userId: string): Promise<JobDataType[]>{
        return await this.find({
            clientId: new Types.ObjectId(userId),
            status: { $in: ['open', 'inprogress'] }
        })
    }

 

    async findAllJobs(skip: number, limit: number, search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<JobDataType[]> {
        const query: FilterQuery<JobDataType> = {isBlocked: false, status: 'open'};
        if (search){
            const regex = new RegExp(search, 'i');
            query.$or = [
            { title: regex },
            { description: regex },
            { category: regex },
            { subCategory: regex }
        ];
        }
        if(filters?.category){
            query.category = filters.category
        }
        if(filters?.subCategory){
            query.subCategory = filters.subCategory
        }
        if(filters?.budgetRange){
            const [minStr, maxStr] = filters.budgetRange.split('-');
            const min = parseInt(minStr);
            const max = parseInt(maxStr);
            if (!isNaN(min) && !isNaN(max)) {
                query.budget = { $gte: min, $lte: max };
            }
        }
        return (
          (await this 
            .find(query, { skip, limit, sort: { createdAt: -1 } })  
            .populate('clientId', 'fullName profilePicture companyName country') 
            .exec()) || []
        );
      }

    async findJobAndDelete(id:string): Promise<JobDataType | null>{
        return await this.findByIdAndDelete(id);
    }

}

export default new JobRepository();