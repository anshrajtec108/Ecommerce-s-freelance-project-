// src/services/apiService.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { handleErrors } from './errorHandler';

const BASE_URL = import.meta.env.VITE_BASE_URL;
// import.meta.env.VITE_STRIPE_PUBLIC_KEY
const getAuthToken = () => {
    // Securely get the token with added checks
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No access token found');
    }
    return token;
};

export const makeGetRequest = async (url, queryParams = {}, headers = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}${url}`, {
            params: queryParams,
            // headers: {
            //     Authorization: `Bearer ${getAuthToken()}`,
            //     ...headers,
            // },
        });
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};

export const makePostRequest = async (url, queryParams, body, headers = {}) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${url}`,
            body,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};

// Similar functions for PUT, PATCH, DELETE with proper content types and error handling

export const makePutRequest = async (url, queryParams, body, headers = {}) => {
    try {
        const response = await axios.put(
            `${BASE_URL}${url}`,
            body,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};

export const makeDeleteRequest = async (url, queryParams, headers = {}) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}${url}`,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};
