export interface EventRecord {
	id?: string;
	_id?: string;
	title: string;
	description: string;
	date: string;
	location: string;
	price: number;
	currency?: string;
	capacity: number;
	ticketsSold: number;
	creator?: { id: string; name: string; email?: string };
}

export const getEventId = (event: EventRecord) => event.id ?? event._id ?? '';

export const formatPrice = (price: number) =>
	price === 0
		? 'Free'
		: new Intl.NumberFormat('en-NG', {
				style: 'currency',
				currency: 'NGN',
				maximumFractionDigits: 0,
			}).format(price);

export const formatEventDate = (date: string) =>
	new Date(date).toLocaleDateString('en-NG', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

export const formatEventTime = (date: string) =>
	new Date(date).toLocaleTimeString('en-NG', {
		hour: 'numeric',
		minute: '2-digit',
	});
