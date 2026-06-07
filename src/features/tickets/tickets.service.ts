import api from '../../api/axios';

export const getMyTickets = async () => {
	const response = await api.get('/tickets/my-tickets');
	return response.data.data;
};

export const setTicketReminder = async (
	ticketId: string,
	delayInHours: number,
) => {
	const response = await api.post(`/tickets/${ticketId}/reminder`, {
		delayInHours,
	});
	return response.data;
};
