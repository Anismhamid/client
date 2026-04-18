import axios from 'axios';

const api = `${import.meta.env.VITE_API_URL}`;

export const getCities = async (): Promise<string[]> => {
    try {
        const citeis = await axios.get(`${api}/cities`);
        return citeis.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return [];
    }
};

export const getStreets = async (city: string): Promise<string[]> => {
    try {
        const response = await axios.get(
            `${api}/cities/${encodeURIComponent(city)}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching streets:', error);
        return [];
    }
};
