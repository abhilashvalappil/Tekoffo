import { useEffect, useState } from "react"
import API from "../services/api";
import { userENDPOINTS } from "../constants/endpointUrl";
import { contractResponse } from "../types/paymentTypes";


export const useFetchContracts = () => {
    const [contracts, setContracts] = useState<contractResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null)

    

    const fetchContracts = async() => {
        try {
            const response  = await API.get(userENDPOINTS.GET_CONTRACTS)
            console.log('console from useFetchcontractssssseeee',response.data)
            setContracts(response.data)
        } catch (err) {
            setError(err as Error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContracts()
    },[])
    
    return {contracts, loading, error, refetch:fetchContracts}
}