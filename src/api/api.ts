import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_API_BASE_URL;

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common function to handle HTTP requests
const requestData = async <T>(
  method: string,
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to make request');
  }
};

// GET request
export const fetchData = async <T>(url: string): Promise<T> => {
  return await requestData<T>('get', url);
};

// POST request
export const postData = async <T>(url: string, postData: any): Promise<T> => {
  return await requestData<T>('post', url, postData);
};

// PUT request
export const putData = async <T>(url: string, putData: any): Promise<T> => {
  return await requestData<T>('put', url, putData);
};

// DELETE request
export const deleteData = async <T>(url: string): Promise<T> => {
  return await requestData<T>('delete', url);
};
