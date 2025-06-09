import { useCallback, useEffect, useState } from "react"
import API from "../../services/api";
import { userENDPOINTS } from "../../constants/endpointUrl";
import { contractResponse } from "../../types/paymentTypes";
import { MetaType } from "../../types/commonTypes";


export const useFetchContracts = (page?:number,limit?:number, search?: string, status?:string ) => {
    const [contracts, setContracts] = useState<contractResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)
    const [meta, setMeta] = useState<MetaType>({
        total: 0,
        page: 1,
        pages: 1,
        limit: 4,
      });

    const fetchContracts = useCallback(async() => {
        try {
            const response = await API.get(userENDPOINTS.GET_CONTRACTS, {
                params: { page, limit, search, status},
              });
            setContracts(response.data.data)
            setMeta(response.data.meta);
        } catch (err) {
            setError(err as Error)
        } finally{
            setLoading(false)
        }
    }, [page, limit, search, status]);

    useEffect(() => {
        fetchContracts()
    },[ fetchContracts])
    
    return {contracts, loading, error, meta, refetch:fetchContracts}
}