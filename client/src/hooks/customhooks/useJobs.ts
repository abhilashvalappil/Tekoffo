import { useEffect,useState } from "react";
import API from "../../services/api";
import { handleApiError } from "../../utils/errors/errorHandler";
import { MetaType } from "../../types/commonTypes";
import { JobFilters } from "../../components/freelancer/dashboard/AvailableJobs";

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

export interface JobDataType {
  _id: string;
  clientId: {
    _id: string;
    companyName: string;
    country: string;
    fullName: string;
    profilePicture: string;
  };
  title: string;
  category: string;
  subCategory: string;
  description: string;
  budget: number;
  duration: string;
  status: 'open' | 'closed' | string;
  requirements: string[];
  isBlocked: boolean;
  createdAt: string;   
  updatedAt: string;   
  __v: number;
}


export function useJobs(endpoint: string, page:number, limit:number, search?: string, filters?: JobFilters){
    const [jobs, setJobs] = useState<JobDataType[]>([]);
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
            const response = await API.get(endpoint,{ params: { page, limit, search,
             category: filters?.category,
             subCategory: filters?.subCategory,
             budgetRange: filters?.budgetRange
            }})
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
    }, [endpoint,page,limit, search, filters])
    return { jobs, loading, error, meta };
}