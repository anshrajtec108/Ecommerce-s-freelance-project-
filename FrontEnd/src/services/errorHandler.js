// src/services/errorHandler.js

export const handleErrors = (error) => {
    const status = error?.response?.status;

    switch (status) {
        case 400:
            console.error('Bad Request:', error.message);
            break;
        case 401:
            console.error('Unauthorized:', error.message);
            // Add logic to handle token refresh or redirect to login
            break;
        case 403:
            console.error('Forbidden:', error.message);
            break;
        case 404:
            console.error('Not Found:', error.message);
            break;
        case 500:
            console.error('Internal Server Error:', error.message);
            break;
        default:
            console.error('An unknown error occurred:', error.message);
    }

    // Optionally throw the error to allow further handling
    throw error;
};
