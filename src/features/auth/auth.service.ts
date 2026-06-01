import api from '../../api/axios';

export const login = async (credentials: {
	email: string;
	password: string;
}) => {
	try {
		console.log('Login attempt to:', api.defaults.baseURL + '/auth/login');
		const response = await api.post('/auth/login', credentials);
		console.log('Login successful:', response.data);
		return response.data;
	} catch (error: any) {
		console.error('Login error details:', {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
			url: error.config?.url,
			method: error.config?.method,
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
		console.log(
			'Register attempt to:',
			api.defaults.baseURL + '/auth/register',
		);
		const response = await api.post('/auth/register', userData);
		console.log('Register successful:', response.data);
		return response.data;
	} catch (error: any) {
		console.error('Register error details:', {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
			url: error.config?.url,
			method: error.config?.method,
		});
		throw error;
	}
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	window.location.href = '/login';
};
