import { useState } from "react";
import API from "../../services/api";
import { handleApiError } from "../../utils/errors/errorHandler";
 


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

  interface Client {
  id:string;
  fullName:string;
  profilePicture:string;
  companyName:string;
  country:string;
  description:string;
  email:string;
  avatarUrl:string;

}

export function useClient() {
    const [client, setClient] = useState<Client | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchClient = async (clientId: string) => {
      try {
        console.log('checkingg',clientId)
        const response = await API.get(`/jobs/client?clientId=${clientId}`);
        // Transform API response to match Client interface
        const clientData : Client= {
          id: response.data._id,
          fullName: response.data.fullName,
          profilePicture: response.data.profilePicture,
          companyName: response.data.companyName,
          country: response.data.country,
          description: response.data.description,
          email: response.data.email,
          avatarUrl: response.data.profilePicture,  
        };
        setClient(clientData);
        setError(null);
         
        return clientData;  
      } catch (error) {
        const errormessage = handleApiError(error)
        setError(errormessage);
        throw error;
      }
    };
  
    return { client, error, fetchClient };
  }