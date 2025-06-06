import { IPlatformEarnings } from "../entities/IPlatformEarnings";

export interface IPlatformRepository {
    recordPlatFormEarnings(data:Partial<IPlatformEarnings>): Promise<void>
    findTotalRevenue(): Promise<number> 
    findTotalEarningsGroupedByMonth(): Promise<{ month: string, earnings: number }[]>
}