import { apiClient } from "./apiClient.js";

// Get all kavlings
export const getAllKavling = async (token) => {
    try {
        const response = await apiClient.get('/kavling', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return all kavling data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create a new kavling
export const createKavling = async (token, request) => {
    try {
        const response = await apiClient.post(
            '/kavling',
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Ensure the request sends JSON
                },
            }
        );
        return response.data; // Return the created kavling data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get a kavling by ID
export const getKavlingById = async (token, id) => {
    try {
        const response = await apiClient.get(`/kavling/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the kavling data for the specified ID
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getKavlingByTgl = async (token, tanggal_kedatangan, tanggal_kepulangan) => {
    try {
        const response = await apiClient.get(`/kavling`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                tanggal_kedatangan,
                tanggal_kepulangan,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update a kavling by ID
export const updateKavlingById = async (token, id, request) => {
    try {
        const response = await apiClient.put(
            `/kavling/${id}`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Ensure the request sends JSON
                },
            }
        );
        return response.data; // Return the updated kavling data
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete a kavling by ID
export const deleteKavlingById = async (token, id) => {
    try {
        const response = await apiClient.delete(`/kavling/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return confirmation of deletion
    } catch (error) {
        throw error.response?.data || error;
    }
};
