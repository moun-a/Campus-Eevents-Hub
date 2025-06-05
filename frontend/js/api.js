// API Configuration
const API_URL = 'http://localhost:3000/api';

// Helper functions
function getToken() {
    return localStorage.getItem('token');
}

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
}

async function handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
    }
    
    return data;
}

// API Service Object
const api = {
    // Auth endpoints
    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    // Events endpoints
    async getAllEvents(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.date) queryParams.append('date', filters.date);
        
        const url = `${API_URL}/events${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    async getEvent(eventId) {
        const response = await fetch(`${API_URL}/events/${eventId}`);
        return handleResponse(response);
    },

    async createEvent(eventData) {
        const token = getToken();
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });
        return handleResponse(response);
    },

    async updateEvent(eventId, eventData) {
        const token = getToken();
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });
        return handleResponse(response);
    },

    async deleteEvent(eventId) {
        const token = getToken();
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    async registerForEvent(eventId) {
        const token = getToken();
        const response = await fetch(`${API_URL}/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: getCurrentUserId() })
        });
        return handleResponse(response);
    },

    async unregisterFromEvent(eventId) {
        const token = getToken();
        const response = await fetch(`${API_URL}/events/${eventId}/unregister`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    // Comments endpoints
    async getEventComments(eventId) {
        const response = await fetch(`${API_URL}/comments/${eventId}`);
        return handleResponse(response);
    },

    async addComment(eventId, content) {
        const token = getToken();
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                event_id: eventId,
                user_id: getCurrentUserId(),
                content
            })
        });
        return handleResponse(response);
    },

    async deleteComment(commentId) {
        const token = getToken();
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    // Categories endpoint
    async getCategories() {
        const response = await fetch(`${API_URL}/categories`);
        return handleResponse(response);
    }
};

export default api; 