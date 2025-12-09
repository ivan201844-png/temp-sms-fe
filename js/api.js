// API Service for fetching phone numbers and SMS messages
const API_BASE_URL = 'https://temporarysms.runasp.net/api';

const api = {
    // Fetch all phone numbers
    async getAllNumbers() {
        try {
            const response = await fetch(`${API_BASE_URL}/numbers`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching numbers:', error);
            throw error;
        }
    },

    // Fetch a specific phone number with its SMS messages
    async getNumberById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/numbers/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching number:', error);
            throw error;
        }
    },

    // Get numbers grouped by country
    async getNumbersByCountry(countryId) {
        try {
            const allNumbers = await this.getAllNumbers();
            return allNumbers.filter(num => num.countryId === countryId);
        } catch (error) {
            console.error('Error fetching numbers by country:', error);
            throw error;
        }
    },

    // Get country stats (number count per country)
    async getCountryStats() {
        try {
            const allNumbers = await this.getAllNumbers();
            const stats = {};

            allNumbers.forEach(num => {
                if (!stats[num.countryId]) {
                    stats[num.countryId] = 0;
                }
                stats[num.countryId]++;
            });

            return stats;
        } catch (error) {
            console.error('Error getting country stats:', error);
            throw error;
        }
    }
};
