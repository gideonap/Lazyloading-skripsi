import axios from 'axios';

const API_URL = 'https://api.perkemahanbedengan.com/api/v1'

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});