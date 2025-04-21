import { apiClient } from "./apiClient.js";

// Fetch all sub grounds by ground ID
export const getAllSubGrounds = async (token, groundId) => {
  try {
    const response = await apiClient.get(`/sub-ground`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ground_id: groundId, // Pass ground_id as query parameter
      },
    });
    return response.data; // Return all sub grounds
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new sub ground
export const createSubGround = async (token, request) => {
  try {
    const response = await apiClient.post(
      '/sub-ground',
      request, // Send the request payload for the new sub ground
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the created sub ground
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a sub ground by ID
export const getSubGroundById = async (token, id) => {
  try {
    const response = await apiClient.get(`/sub-ground/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the specific sub ground
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update a sub ground by ID
export const updateSubGroundById = async (token, id, request) => {
  try {
    const response = await apiClient.put(
      `/sub-ground/${id}`,
      request, // Send updated sub ground data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return updated sub ground
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a sub ground by ID
export const deleteSubGroundById = async (token, id) => {
  try {
    const response = await apiClient.delete(`/sub-ground/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return delete confirmation
  } catch (error) {
    throw error.response?.data || error;
  }
};
