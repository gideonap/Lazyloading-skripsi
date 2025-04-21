import { apiClient } from "./apiClient.js";

// GET all perlengkapan
export const getAllPerlengkapan = async (token, query) => {
  try {
    const response = await apiClient.get(`/perlengkapan${(query) ? `?${query}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// POST (create) perlengkapan with image
export const createPerlengkapan = async (token, formData) => {
  try {
    const response = await apiClient.post('/perlengkapan', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // for handling image uploads
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET perlengkapan by ID
export const getPerlengkapanById = async (token, id) => {
  try {
    const response = await apiClient.get(`/perlengkapan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// PUT (update) perlengkapan by ID with image
export const updatePerlengkapanById = async (token, id, formData) => {
  try {
    const response = await apiClient.put(`/perlengkapan/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // for handling image uploads
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// DELETE perlengkapan by ID
export const deletePerlengkapanById = async (token, id) => {
  try {
    const response = await apiClient.delete(`/perlengkapan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};