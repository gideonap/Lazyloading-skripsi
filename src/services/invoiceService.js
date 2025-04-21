import { apiClient } from "./apiClient.js";

export const getAllInvoiceReservasi = async (token) => {
    try {
        const response = await apiClient.get('/invoice-reservasi', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAllInvoiceReservasiAdmin = async (token) => {
    try {
        const response = await apiClient.get('/admin/invoice-reservasi', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getInvoiceReservasiById = async (token, id) => {
    try {
        const response = await apiClient.get(`/invoice-reservasi/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createInvoiceReservasi = async (token, request) => {
    try {
        const response = await apiClient.post(
            '/invoice-reservasi',
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateInvoiceReservasiById = async (token, id, request) => {
    try {
        const response = await apiClient.put(
            `/invoice-reservasi/${id}`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteInvoiceReservasiById = async (token, id) => {
    try {
        const response = await apiClient.delete(`/invoice-reservasi/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const rejectInvoiceReservasi = async (token, id) => {
    try {
        const response = await apiClient.put(`/invoice-reservasi/${id}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifyInvoiceReservasi = async (token, id) => {
    try {
        const response = await apiClient.put(`/invoice-reservasi/${id}/confirm`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateInvoiceReservasiFiles = async (token, id, formData) => {
    try {
        const response = await apiClient.put(
            `/invoice-reservasi/${id}/file`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
