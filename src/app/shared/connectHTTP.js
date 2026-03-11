import axios from 'axios';
import config from "@/app/config/config";
export const request = async (page,debug,get=true,data={}) => {
    let port = config.portAXIOS;
    try {
        let response;
        if (typeof window !== "undefined") {
            const API_BASE_URL = window.location.origin.replace("3000", port);
            if (get){
                if (debug){console.log(`Sending get request ${API_BASE_URL}/${page}`);}
                response = await axios.get(`${API_BASE_URL}/${page}`);
            }else{
                if (debug){console.log(`Sending post request ${API_BASE_URL}/${page}`);}
                response = await axios.post(`${API_BASE_URL}/${page}`,data);
            }
        }else{
            if (debug){console.log("window is undefined");}
        }
        if (debug){console.log(`Received`,response.data);}
        return response.data;
    } catch (error) {
        if (debug){console.error("Error :", error);}
        throw error;
    }
};