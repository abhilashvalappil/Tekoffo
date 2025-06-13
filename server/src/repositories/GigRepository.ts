import Gig from '../models/GigModel'
import { CreateGigDTO, IGig, IGigRepository } from '../interfaces'
import BaseRepository from './BaseRepository'
import { PipelineStage, Types } from 'mongoose'

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

    // async findGigs(skip: number, limit: number,search?: string): Promise<IGig[]> {
    //     return await Gig.aggregate([
    //         {
    //             $match: {
    //                 isActive: true
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'users',  
    //                 localField: 'freelancerId',
    //                 foreignField: '_id',
    //                 as: 'freelancer'
    //             }
    //         },
    //         {
    //             $unwind: '$freelancer'
    //         },
    //         {
    //             $lookup: {
    //                 from: 'reviews',
    //                 localField: 'freelancerId',
    //                 foreignField: 'reviewedUserId',
    //                 as: 'reviews'
    //             }
    //         },
    //         {
    //             $addFields: {
    //                 averageRating: { $avg: '$reviews.rating' },
    //                 totalReviews: { $size: '$reviews' }
    //             }
    //         },
    //         {
    //             $project: {
    //                 title: 1,
    //                 description: 1,
    //                 category: 1,
    //                 price: 1,
    //                 revisions: 1,
    //                 deliveryTime: 1,
    //                 skills: 1,
    //                 requirements: 1,
    //                 freelancer: {
    //                     _id: 1,
    //                     fullName: 1,
    //                     profilePicture: 1
    //                 },
    //                 averageRating: { $ifNull: ['$averageRating', 0] },
    //                 totalReviews: 1
    //                 }
    //             },
    //             { $skip: skip }, 
    //             { $limit: limit }, 
    //         ]);
    //  }
    async findGigs(skip: number, limit: number, search?: string): Promise<IGig[]> {
        const pipeline: PipelineStage[] = [];

        pipeline.push({
            $match: {
            isActive: true,
            },
        });

        if (search && search.trim()) {
            const regex = new RegExp(search, 'i');
            pipeline.push({
            $match: {
                $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                ],
            },
            });
        }

        pipeline.push(
            {
            $lookup: {
                from: 'users',
                localField: 'freelancerId',
                foreignField: '_id',
                as: 'freelancer',
            },
            },
            { $unwind: '$freelancer' },
            {
            $lookup: {
                from: 'reviews',
                localField: 'freelancerId',
                foreignField: 'reviewedUserId',
                as: 'reviews',
            },
            },
            {
            $addFields: {
                averageRating: { $avg: '$reviews.rating' },
                totalReviews: { $size: '$reviews' },
            },
            },
            {
            $project: {
                title: 1,
                description: 1,
                category: 1,
                price: 1,
                revisions: 1,
                deliveryTime: 1,
                skills: 1,
                requirements: 1,
                freelancer: {
                _id: 1,
                fullName: 1,
                profilePicture: 1,
                },
                averageRating: { $ifNull: ['$averageRating', 0] },
                totalReviews: 1,
            },
            },
            { $skip: skip },
            { $limit: limit }
        );

        return await Gig.aggregate<IGig>(pipeline);
    }

    //  async countGigs(search?: string): Promise<number>{
    //     return await this.count();
    //  }
    async countGigs(search?: string): Promise<number> {
    if (search && search.trim()) {
        const regex = new RegExp(search, 'i');
        return await Gig.countDocuments({
        isActive: true,
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
        ],
        });
    }

    return await Gig.countDocuments({ isActive: true });
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