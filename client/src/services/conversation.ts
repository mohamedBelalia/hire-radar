import { expressServer } from "@/lib/express-server";

export const getConvs = async () =>{
    const response = await expressServer.get(`/api/conversation/get`);    
    return response
}

export const startNew = async (otherPaticipantId: string) =>{
    const response = await expressServer.post(`/api/conversation/startNew`,{otherPaticipantId});    
    return response;
}