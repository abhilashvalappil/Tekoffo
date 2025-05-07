import { useEffect,useState } from "react";
import API from "../services/api";
import { handleApiError } from "../utils/errors/errorHandler";

export interface jobData {
    _id:string;
    title:string;
    category:string;
    subCategory:string;
    description:string;
    requirements:string[];
    budget:number;
    duration:string;
    clientId:{
        _id:string;
        fullName:string;
        profilePicture?:string;
        companyName?:string;
        country:string;
    },
    createdAt:string;
    updatedAt:string;
}


export function useJobs(endpoint: string){
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
        try {
            const response = await API.get(endpoint)
            console.log('console from customhook usejobssssss',response.data.jobs)
            setJobs(response.data.jobs)
        } catch (error) {
            const errormessage = handleApiError(error)
            setError(errormessage);
        }finally {
           setLoading(false);
        }
    }
    fetchJobs();
    }, [endpoint])
    return { jobs, loading, error };
}