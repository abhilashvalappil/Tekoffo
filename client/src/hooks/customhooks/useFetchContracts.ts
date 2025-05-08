import { useEffect, useState } from "react"
import API from "../../services/api";
import { userENDPOINTS } from "../../constants/endpointUrl";
import { contractResponse } from "../../types/paymentTypes";


export const useFetchContracts = (search: string,page = 1,limit = 3,  statusFilter: string, timeFilter: string) => {
    const [contracts, setContracts] = useState<contractResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)
    const [meta, setMeta] = useState<MetaType>({
        total: 0,
        page: 1,
        pages: 1,
        limit: 4,
      });
    

    const fetchContracts = async() => {
        try {
           
            // const response = await API.get(
            //     `${userENDPOINTS.GET_CONTRACTS}?search=${search}&status=${statusFilter}&time=${timeFilter}`
            //   );
            const response = await API.get(userENDPOINTS.GET_CONTRACTS, {
                params: { page, limit, search, status: statusFilter, time: timeFilter },
              });
            console.log('console from useFetchcontractssssseeee',response.data)
            setContracts(response.data.data)
            setMeta(response.data.meta);
        } catch (err) {
            setError(err as Error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContracts()
    },[search, statusFilter, timeFilter, page, limit])
    
    return {contracts, loading, error, meta, refetch:fetchContracts}
}