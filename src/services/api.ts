import axios from 'axios';
import { DocumentInput, ApiResponse, UploadResponse } from '../types/document';

const API_URL = 'https://app.veldev.com/v1';
const API_TOKEN = 'app-S4WCXHdQ2uxqINTg1Sw6FhEZ';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file: File, user: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user', user);

  const uploadApi = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  try {
    const response = await uploadApi.post('/files/upload', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error uploading file');
    }
    throw error;
  }
};

export const processDocument = async (input: DocumentInput): Promise<ApiResponse> => {
  try {
    const response = await api.post('/workflows/run', input);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error processing document');
    }
    throw error;
  }
}; 