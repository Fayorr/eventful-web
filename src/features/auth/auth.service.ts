import api from '../../api/axios';

export const login = async (credentials: { email: string; password: string }) => {
	const response = await api.post('/auth/login', credentials);
	return response.data;
};

export const register = async (userData: {
	name: string;
	email: string;
	password: string;
	role: string;
}) => {
	const response = await api.post('/auth/register', userData);
	return response.data;
};

export const resendVerification = async (email: string) => {
	const response = await api.post('/auth/resend-verification', { email });
	return response.data;
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('user');
	window.location.assign('/login');
};
