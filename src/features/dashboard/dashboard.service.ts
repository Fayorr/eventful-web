import api from '../../api/axios';

export const getCreatorAnalytics = async () => {
	const response = await api.get('/analytics/global');
	return response.data;
};

export const getPaymentHistory = async () => {
	const response = await api.get('/payments/history');
	return response.data;
};
