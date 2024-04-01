import axios from 'axios';

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Get access token from sessionStorage
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
  return await requestData<T>('post', url, postData);
};

// PUT request
export const putData = async <T>(url: string, putData: any) => {
  return await requestData<T>('put', url, putData);
};

// DELETE request
export const deleteData = async <T>(url: string) => {
  return await requestData<T>('delete', url);
};
