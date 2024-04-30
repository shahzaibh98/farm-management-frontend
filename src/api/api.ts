import axios from 'axios';
import store from '../redux';

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
const token = store.getState()?.userInfo?.token;

console.log(token);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token') ?? token}`, // Get access token from sessionStorage
  },
});

// Common function to handle HTTP requests
const requestData = async <T>(method: string, url: string, data?: any) => {
  const response = await axiosInstance.request<T>({
    method,
    url,
    data,
  });
  return response.data;
};

// GET request
export const fetchData = async <T>(url: string) => {
  return await requestData<T>('get', url);
};

// POST request
export const postData = async <T>(url: string, postData: any) => {
  const userDetails = store.getState()?.userInfo?.userInfo;
  return await requestData<T>(
    'post',
    url,
    userDetails
      ? {
          ...postData,
          createdBy: userDetails.userId.toString(),
          updatedBy: userDetails.userId.toString(), // Update updatedBy value with userDetails.userId,
        }
      : postData
  );
};

// PUT request
export const putData = async <T>(url: string, putData: any) => {
  const userDetails = store.getState()?.userInfo?.userInfo;
  return await requestData<T>('put', url, {
    ...putData,
    updatedBy: userDetails.userId.toString(), // Update updatedBy value with userDetails.userId,
  });
};

// DELETE request
export const deleteData = async <T>(url: string) => {
  return await requestData<T>('delete', url);
};
