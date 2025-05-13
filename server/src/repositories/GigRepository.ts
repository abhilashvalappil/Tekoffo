import Gig from '../models/GigModel'
import { CreateGigDTO, IGig, IGigRepository } from '../interfaces'
import BaseRepository from './BaseRepository'
import { Types } from 'mongoose'

class GigRepository extends BaseRepository<IGig> implements IGigRepository {
    constructor(){
        super(Gig)
    }
    
    async createGig(freelancerId:string, gig:CreateGigDTO): Promise<IGig> {
        const gigData = {
            ...gig,
            freelancerId: new Types.ObjectId(freelancerId)
        }
        return await this.create(gigData)
    }

    async findGigById(id:string): Promise<IGig | null> {
        return await this.findById(id)
    }

    async findByIdAndUpdate(id:string,gig:Partial<IGig>): Promise<IGig | null> {
        return await this.updateById(id,gig)
    }

    async findGigByIdAndDelete(id:string): Promise<IGig | null>  {
        return await this.findByIdAndDelete(id)
    }

    async findGigCountByFreelancerId(id:string): Promise<number>{
        return await this.count({freelancerId:id})
    }

    async findGigsByFreelancerId(id:string): Promise<IGig[] | null> {
        return await this.find({freelancerId:id})
    }
}

export default new GigRepository();