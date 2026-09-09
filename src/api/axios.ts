import axios from 'axios';

const configuredUrl = (
	import.meta.env.VITE_API_URL || 'https://eventful-api.hostless.app'
)
	.trim()
	.replace(/\/+$/, '');

// Keep the first configured API version and collapse accidental duplicates such
// as `/api/v1/api/v2` into one canonical base URL.
const configuredVersion = configuredUrl.match(/\/api\/(v\d+)/)?.[1] || 'v1';
const apiOrigin = configuredUrl.replace(/(?:\/api\/v\d+)+$/, '');
const useDevelopmentProxy =
	import.meta.env.DEV && apiOrigin === 'https://eventful-api.hostless.app';
const baseURL = useDevelopmentProxy
	? `/api/${configuredVersion}`
	: `${apiOrigin}/api/${configuredVersion}`;

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
