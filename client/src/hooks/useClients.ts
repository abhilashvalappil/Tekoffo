import { useState } from "react";
import API from "../services/api";
 


// export function useClient(){
//     const [client,setClient] = useState(null);
//     const [error, setError] = useState(null);

//     const fetchClient = async(clientId:string) => {
//         try {
//             const response = await API.get(`/jobs/client?clientId=${clientId}`)
//             console.log('client datas fetchingggg',response.data)
//             setClient(response.data)
//         } catch (error) {
//             console.log("error typeeeeeeeeeeeeeeeee",typeof error)
//             setError(error)
//         }
//     }
//     return { client, error, fetchClient };
// }

export function useClient() {
    const [client, setClient] = useState<Client | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchClient = async (clientId: string) => {
      try {
        console.log('checkingggggggggggggggg',clientId._id)
        const response = await API.get(`/jobs/client?clientId=${clientId._id}`);
        // Transform API response to match Client interface
        const clientData= {
          id: response.data._id,
          fullName: response.data.fullName,
          profilePicture: response.data.profilePicture,
          companyName: response.data.companyName,
          country: response.data.country,
          description: response.data.description,
          email: response.data.email,
          avatarUrl: response.data.profilePicture, // Map profilePicture to avatarUrl
        };
        setClient(clientData);
        setError(null);
         
        return clientData;  
      } catch (error: any) {
        console.error('Error fetching client:', error);
        setError(error.message || 'Failed to fetch client');
        throw error;
      }
    };
  
    return { client, error, fetchClient };
  }