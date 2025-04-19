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

    async findJobsByClientId(clientId: string): Promise<JobDataType[]> {
        return await this.find({ clientId: new Types.ObjectId(clientId) });
    }

    async getAllJobs(): Promise<JobDataType[]>{
        return (await this.find({ isBlocked: false })) || [];
    }

    async findJobAndDelete(id:string): Promise<JobDataType | null>{
        return await this.findByIdAndDelete(id);
    }

}

export default new JobRepository();