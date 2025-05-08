import { useEffect,useState } from "react";
import API from "../../services/api";
import { handleApiError } from "../../utils/errors/errorHandler";

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


export function useJobs(endpoint: string,page:number,limit:number){
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meta, setMeta] = useState<MetaType>({
        total: 0,
        page: 1,
        pages: 1,
        limit: 4,
      });

    useEffect(() => {
        const fetchJobs = async () => {
        try {
            const response = await API.get(endpoint,{ params: { page, limit }})
            console.log('console from customhook usejobssssss',response.data.data)
            setJobs(response.data.data)
            setMeta(response.data.meta);
        } catch (error) {
            const errormessage = handleApiError(error)
            setError(errormessage);
        }finally {
           setLoading(false);
        }
    }
    fetchJobs();
    }, [endpoint,page,limit])
    return { jobs, loading, error, meta };
}