import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const transcriptAPI = {
  // Upload transcript file
  uploadTranscript: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transcript/upload', formData);
    return response.data;
  },

  // Upload and analyze transcript in one step
  analyzeTranscript: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transcript/analyze', formData);
    return response.data;
  },

  // Analyze previously uploaded transcript
  analyzeUploadedTranscript: async (fileId) => {
    const response = await api.get(`/transcript/analyze/${fileId}`);
    return response.data;
  },
};

export default api;
