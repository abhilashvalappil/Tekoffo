import { Types } from 'mongoose';
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

    async updateJobPost(id:string, job:Partial<JobDataType>): Promise<JobDataType | null> {
        return await this.updateById(id,{...job,updated_At: new Date()})
    }

    async findJobById(id:string): Promise<JobDataType | null>{
        return await this.findById(id)
    }

    async findJobsByClientId(clientId: string,skip: number, limit: number): Promise<JobDataType[]> {
        return await this.find({ clientId: new Types.ObjectId(clientId) },{skip, limit, sort: { createdAt: -1 } });
    }

    async countJobs(): Promise<number> {
        return await this.count();   
      }
 

    async findAllJobs(): Promise<JobDataType[]> {
        return (
          (await this 
            .find({ isBlocked: false, status: 'open' })  
            .populate('clientId', 'fullName profilePicture companyName country') 
            .exec()) || []
        );
      }

    async findJobAndDelete(id:string): Promise<JobDataType | null>{
        return await this.findByIdAndDelete(id);
    }

}

export default new JobRepository();