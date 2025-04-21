import { apiClient } from "./apiClient.js";

// Fetch all ground data with sub_grounds and kavlings
export const getAllGround = async (token) => {
    try {
        const response = await apiClient.get('/ground', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create a new ground with image upload
export const createGround = async (token, request) => {
    try {
        const formData = new FormData();
        formData.append('nama', request.nama); // Append the correct field name
        formData.append('image', request.image); // Append the image file
        
        const response = await apiClient.post(
            '/ground',
            formData, // Send formData for handling file upload
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set the content type for file upload
                },
            }
        );
        return response.data; // Return created ground data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get ground by ID with sub_grounds and kavlings
export const getGroundById = async (token, id) => {
    try {
        const response = await apiClient.get(`/ground/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the specific ground data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update ground by ID with image upload
export const updateGroundById = async (token, id, request) => {
    try {
        const formData = new FormData();
        formData.append('name', request.name); // Append updated name
        if (request.image) {
            formData.append('image', request.image); // Append image only if provided
        }

        const response = await apiClient.put(
            `/ground/${id}`,
            formData, // Send formData for handling file upload
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data; // Return updated ground data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete ground by ID
export const deleteGroundById = async (token, id) => {
    try {
        const response = await apiClient.delete(`/ground/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return delete confirmation
    } catch (error) {
        throw error.response?.data || error;
    }
};
