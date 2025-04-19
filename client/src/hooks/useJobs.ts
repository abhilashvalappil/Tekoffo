import { useEffect,useState } from "react";
import API from "../services/api";


export function useJobs(endpoint: string){
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
        try {
            const response = await API.get(endpoint)
            console.log('console from usejob.tss',response.data.jobs)
            setJobs(response.data.jobs)
        } catch (error:any) {
            setError(error.message || 'Failed to fetch jobs');
        }finally {
           setLoading(false);
        }
    }
    fetchJobs();
    }, [endpoint])
    return { jobs, loading, error };
}