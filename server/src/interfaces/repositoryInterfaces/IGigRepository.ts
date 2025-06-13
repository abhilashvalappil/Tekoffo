import { CreateGigDTO, IGig } from "../entities/IGig";

export interface IGigRepository {
    createGig(freelancerId:string,gig:CreateGigDTO): Promise<IGig>
    findGigById(id:string): Promise<IGig | null>
    findGigs(skip: number, limit: number,search?: string): Promise<IGig[]>
    countGigs(search?: string): Promise<number>
    findByIdAndUpdate(id:string,gig:Partial<IGig>): Promise<IGig | null>
    findGigByIdAndDelete(id:string): Promise<IGig | null>
    findGigCountByFreelancerId(id:string): Promise<number>
    findGigsByFreelancerId(id:string): Promise<IGig[] | null>
}