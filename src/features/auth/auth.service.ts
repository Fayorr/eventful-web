import api from '../../api/axios';

export const login = async (credentials: {
	email: string;
	password: string;
}) => {
	try {
		const baseURL = api.defaults.baseURL;
		const fullURL = `${baseURL}/auth/login`;
		console.log('🔐 Login attempt:', {
			email: credentials.email,
			url: fullURL,
		});

		const response = await api.post('/auth/login', credentials);
		console.log('✅ Login successful:', response.data);
		return response.data;
	} catch (error: unknown) {
		const err = error as {
			message?: string;
			response?: { status?: number; statusText?: string; data?: unknown };
			config?: { url?: string; baseURL?: string; method?: string };
		};
		console.error('❌ Login error details:', {
			message: err.message,
			status: err.response?.status,
			statusText: err.response?.statusText,
			data: err.response?.data,
			url: err.config?.url,
			baseURL: err.config?.baseURL,
			method: err.config?.method,
			isNetworkError: !err.response,
		});
		throw error;
	}
};

export const register = async (userData: {
	name: string;
	email: string;
	password: string;
	role: string;
}) => {
	try {
		const baseURL = api.defaults.baseURL;
		const fullURL = `${baseURL}/auth/register`;
		console.log('📝 Register attempt:', {
			email: userData.email,
			url: fullURL,
		});

		const response = await api.post('/auth/register', userData);
		console.log('✅ Register successful:', response.data);
		return response.data;
	} catch (error: unknown) {
		const err = error as {
			message?: string;
			response?: { status?: number; statusText?: string; data?: unknown };
			config?: { url?: string; baseURL?: string; method?: string };
		};
		console.error('❌ Register error details:', {
			message: err.message,
			status: err.response?.status,
			statusText: err.response?.statusText,
			data: err.response?.data,
			url: err.config?.url,
			baseURL: err.config?.baseURL,
			method: err.config?.method,
			isNetworkError: !err.response,
		});
		throw error;
	}
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	window.location.href = '/login';
};
