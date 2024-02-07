import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const createBookingApi = async (id, bookingData) => {
    try {
        await api.post(`/api/booking/${id}`, bookingData);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const updateBookingApi = async (id, bookingData) => {
    try {
        await api.put(`/api/booking/${id}`, bookingData);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deleteBookingApi = async (id) => {
    try {
        await api.delete(`/api/booking/${id}`);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};