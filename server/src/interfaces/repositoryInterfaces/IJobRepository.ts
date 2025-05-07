import { JobDataType } from "../entities/IJob";

export interface IJobRepository {
    createJobPost(clientId:string,job:Partial<JobDataType>): Promise<JobDataType>
    findJobById(id:string): Promise<JobDataType | null>
    findJobsByClientId(clientId: string,skip: number, limit: number): Promise<JobDataType[]>
    countJobs(): Promise<number>
    findAllJobs(): Promise<JobDataType[]>
    updateJobPost(id:string, job:Partial<JobDataType>): Promise<JobDataType | null>;
    findJobAndDelete(id:string): Promise<JobDataType | null>
}