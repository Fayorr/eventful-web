import { ArrowLeft, CalendarDays, LockKeyhole, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { formatEventDate, formatEventTime, formatPrice, type EventRecord } from '../features/events/event.types';

export const Checkout = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const navigate = useNavigate();
	const [event, setEvent] = useState<EventRecord | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!eventId) return;
		api.get(`/events/${eventId}`)
			.then((response) => setEvent(response.data.data ?? response.data))
			.catch((err) => setError(err.response?.data?.message || 'We could not load this event.'))
			.finally(() => setIsLoading(false));
	}, [eventId]);

	useEffect(() => {
		const reset = () => setIsProcessing(false);
		window.addEventListener('pageshow', reset);
		return () => window.removeEventListener('pageshow', reset);
	}, []);

	const buyTicket = async () => {
		if (!eventId) return;
		setIsProcessing(true);
		setError('');
		try {
			const response = await api.post(`/tickets/buy/${eventId}`, {
				callbackUrl: `${window.location.origin}/payment/verify`,
			});
			const data = response.data?.data ?? response.data;
			const paymentUrl = data.authorizationUrl ?? data.authorization_url;
			if (paymentUrl) {
				if (data.reference) localStorage.setItem('paystack_reference', data.reference);
				window.location.assign(paymentUrl);
				return;
			}
			navigate('/my-tickets');
		} catch (err: unknown) {
			const failure = err as { response?: { data?: { message?: string } } };
			setError(failure.response?.data?.message || 'We could not reserve this ticket.');
			setIsProcessing(false);
		}
	};

	if (isLoading) return <div className='border border-line bg-white px-6 py-16 text-center text-slate-600'>Loading checkout…</div>;
	if (!event) return <div role='alert' className='border-l-4 border-red-600 bg-red-50 px-5 py-4 text-red-800'>{error || 'Event not found.'}</div>;

	return (
		<div className='mx-auto max-w-5xl'>
			<Link to={`/events/${eventId}`} className='inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ink'><ArrowLeft size={17} />Back to event</Link>
			<div className='mt-6 grid overflow-hidden border border-line bg-white lg:grid-cols-[1fr_22rem]'>
				<section className='p-6 sm:p-10'>
					<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Checkout</p>
					<h1 className='mt-3 text-4xl font-bold tracking-tight text-ink'>Confirm your ticket</h1>
					<p className='mt-3 max-w-xl text-slate-600'>Review the event details before continuing.</p>

					<div className='mt-9 border-t border-line pt-7'>
						<h2 className='text-2xl font-bold text-ink'>{event.title}</h2>
						<p className='mt-3 line-clamp-3 leading-7 text-slate-600'>{event.description}</p>
						<div className='mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2'>
							<p className='flex gap-3'><CalendarDays className='shrink-0 text-primary' size={19} /><span>{formatEventDate(event.date)}<strong className='block text-ink'>{formatEventTime(event.date)}</strong></span></p>
							<p className='flex gap-3'><MapPin className='shrink-0 text-primary' size={19} /><span>{event.location}</span></p>
						</div>
					</div>
				</section>

				<aside className='border-t border-line bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0'>
					<p className='text-sm font-semibold text-slate-500'>Total</p>
					<p className='mt-2 text-4xl font-bold tracking-tight text-ink'>{formatPrice(event.price)}</p>
					{error && <div role='alert' className='mt-5 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800'>{error}</div>}
					<Button onClick={buyTicket} isLoading={isProcessing} loadingText='Preparing checkout…' className='mt-7 w-full'>{event.price === 0 ? 'Reserve free ticket' : 'Continue to Paystack'}</Button>
					<p className='mt-5 flex items-start gap-2 text-sm leading-6 text-slate-500'><LockKeyhole className='mt-0.5 shrink-0' size={16} />{event.price === 0 ? 'No payment is required.' : 'Payment is completed securely on Paystack.'}</p>
				</aside>
			</div>
		</div>
	);
};
