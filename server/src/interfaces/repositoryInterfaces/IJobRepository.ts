import { JobDataType } from "../entities/IJob";

export interface IJobRepository {
    createJobPost(clientId:string,job:Partial<JobDataType>): Promise<JobDataType>
    findJobById(id:string): Promise<JobDataType | null>
    findJobsByClientId(clientId: string,skip: number, limit: number,search?: string,filters?: { status?: string; category?: string; subCategory?: string }): Promise<JobDataType[]>
    countJobsByClientId(clientId:string,search?: string,filters?: { status?: string; category?: string; subCategory?: string }): Promise<number>
    countJobs(): Promise<number>
    findActiveJobsCount(): Promise<number>
    countFilteredJobs(search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<number>
    findActiveJobsCountByUserId(userId: string): Promise<number>
    findCompletedJobsCountByUserId(userId: string): Promise<number> 
    findActiveJobPostsByUserId(userId: string): Promise<JobDataType[]>
    findAllJobs(skip: number, limit: number, search?: string, filters?: { category?: string; subCategory?: string; budgetRange?: string }): Promise<JobDataType[]>
    updateJobPost(id:string, job:Partial<JobDataType>): Promise<JobDataType | null>;
    findJobAndDelete(id:string): Promise<JobDataType | null>
}