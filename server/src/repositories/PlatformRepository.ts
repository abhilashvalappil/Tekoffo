import { IPlatformEarnings, IPlatformRepository } from '../interfaces';
import BaseRepository from './BaseRepository';
import PlatformEarnings from '../models/PlatformEarningsModel'

class PlatformRepository extends BaseRepository<IPlatformEarnings> implements IPlatformRepository {
    constructor(){
        super(PlatformEarnings)
    }

    async recordPlatFormEarnings(data:Partial<IPlatformEarnings>): Promise<void>{
        await this.create(data)
    }

    async findTotalRevenue(): Promise<number> {
        const result =  await PlatformEarnings.aggregate([
            {
                $group:{
                    _id:null,
                    total:{$sum: "$platformCommission"}
                }
            }
        ])
         return result[0]?.total || 0;
    }

    async findTotalEarningsGroupedByMonth(): Promise<{ month: string, earnings: number }[]> {
        return await PlatformEarnings.aggregate([
            {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                earnings: { $sum: "$platformCommission" }
            }
            },
            {
            $sort: { _id: 1 }
            },
            {
            $project: {
                _id: 0,
                month: "$_id",
                earnings: 1
            }
            }
        ]);
    }

}

export default new PlatformRepository();