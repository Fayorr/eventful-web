import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

interface Event {
	_id: string;
	title: string;
	description: string;
	price: number;
	location: string;
	date: string;
}

export const Checkout: React.FC = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const navigate = useNavigate();
	const [event, setEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await api.get(`/events/${eventId}`);
				setEvent(response.data.data || response.data);
			} catch (err: unknown) {
				const error = err as { response?: { data?: { message?: string } } };
				const errorMsg =
					error.response?.data?.message || 'Failed to load event details';
				setError(errorMsg);
				console.error('Event fetch error:', errorMsg);
			} finally {
				setIsLoading(false);
			}
		};

		if (eventId) {
			fetchEvent();
		}
	}, [eventId]);
	// Reset the loading state if the user clicks the browser's "Back" button
	useEffect(() => {
		const handlePageShow = (event: PageTransitionEvent) => {
			// event.persisted is true if the page was loaded from the browser's back/forward cache
			if (event.persisted) {
				setIsProcessing(false);
			}
		};

		window.addEventListener('pageshow', handlePageShow);

		// Cleanup listener
		return () => {
			window.removeEventListener('pageshow', handlePageShow);
		};
	}, []);
	const handleBuyTicket = async () => {
		if (!eventId) return;

		setIsProcessing(true);
		setError('');

		try {
			// Hit the backend to initialize the ticket
			const response = await api.post(`/tickets/buy/${eventId}`);

			// Safely grab the data WITHOUT destructuring it immediately
			const responseData = response.data?.data || response.data;

			// SCENARIO 1: Paid Event (Backend provided a Paystack URL)
			if (responseData && responseData.authorization_url) {
				localStorage.setItem('paystack_reference', responseData.reference);
				window.location.href = responseData.authorization_url;
			}
			// SCENARIO 2: Free Event (Backend skipped Paystack)
			else {
				// Find the reference, or use a default one for free tickets
				const reference =
					responseData?.ticket?.paymentReference ||
					responseData?.reference ||
					`free_${Date.now()}`;

				// Immediately send them to the success/verification page
				navigate(`/payment/verify?reference=${reference}`);
			}
		} catch (err) {
			const error = err as { response?: { data?: { message?: string } } };
			const errorMsg =
				error.response?.data?.message || 'Failed to initialize payment';
			setError(errorMsg);
			console.error('Payment initialization error:', errorMsg);
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>Loading event details...</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center text-red-600'>Event not found</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-gray-50'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<h1 className='mb-6 text-2xl font-bold text-dark'>
					Complete Your Purchase
				</h1>

				{error && (
					<div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md wrap-break-word'>
						{error}
					</div>
				)}

				<div className='p-4 mb-6 rounded-lg bg-gray-50'>
					<h2 className='mb-2 text-lg font-bold'>{event.title}</h2>
					<p className='mb-3 text-sm text-gray-600'>{event.description}</p>

					<div className='mb-2 text-sm text-gray-500'>
						📅 {new Date(event.date).toLocaleDateString()}
					</div>
					<div className='mb-4 text-sm text-gray-500'>📍 {event.location}</div>

					<div className='flex items-center justify-between pt-4 border-t'>
						<span className='font-medium'>Price:</span>
						<span className='text-xl font-bold text-emerald-600'>
							{event.price === 0 ? 'FREE' : `₦${event.price.toLocaleString()}`}
						</span>
					</div>
				</div>

				{event.price === 0 ? (
					<div className='p-4 mb-4 border rounded-lg bg-green-50 border-green-200'>
						<p className='text-sm text-green-700'>
							This is a free event. Click below to register.
						</p>
					</div>
				) : (
					<div className='p-4 mb-4 border rounded-lg bg-blue-50 border-blue-200'>
						<p className='text-sm text-blue-700'>
							You will be redirected to Paystack to complete the payment
							securely.
						</p>
					</div>
				)}

				<Button
					className='w-full mb-4'
					onClick={handleBuyTicket}
					isLoading={isProcessing}
					disabled={isProcessing}
				>
					{event.price === 0 ? 'Register for Free' : 'Pay with Paystack'}
				</Button>

				<button
					onClick={() => navigate('/events')}
					className='w-full text-sm text-center text-gray-500 hover:text-gray-700'
				>
					Back to Events
				</button>
			</div>
		</div>
	);
};;
