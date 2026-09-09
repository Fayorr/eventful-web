import axios from 'axios';

const backendUrl =
	import.meta.env.VITE_API_URL || 'https://eventful-api.hostless.app';
const baseURL = new URL('/api/v2', backendUrl).toString();

const api = axios.create({
	baseURL,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

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
