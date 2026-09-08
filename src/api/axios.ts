import axios from 'axios';

const configuredUrl = (
	import.meta.env.VITE_API_URL || 'https://eventful-api.hostless.app'
).replace(/\/$/, '');

const baseURL = /\/api\/v\d+$/.test(configuredUrl)
	? configuredUrl
	: `${configuredUrl}/api/v1`;

const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request Interceptor: Automatically attach the Bearer token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');
		}
		return Promise.reject(error);
	},
);

export default api;
