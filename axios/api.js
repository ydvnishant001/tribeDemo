import axios from "axios";

const instance = axios.create({
    baseURL: 'http://dummy-chat-server.tribechat.pro/api'
});

export const getAllMessages = async () => {
  try{
    const response = await instance.get('/messages/all')
    if(response.status === 200) return response.data
  }
  catch(error){
    console.error(error);
  }
}

export const getAllParticipants = async () => {
  try{
    const response = await instance.get('/participants/all')
    if(response.status === 200) return response.data
  }
  catch(error){
    console.error(error);
  }
}

export const postMessage = async (text) => {
  try{
    const response = await instance.post('/messages/new', {text})
    if(response.status === 200) return response.data
  }
  catch(error){
    console.error(error);
  }
}