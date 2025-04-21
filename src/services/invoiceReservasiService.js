import {apiClient} from "./apiClient.js";

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
}


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