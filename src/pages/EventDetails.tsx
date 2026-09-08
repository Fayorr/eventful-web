import { ArrowLeft, CalendarDays, MapPin, Share2, TicketCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { formatEventDate, formatEventTime, formatPrice, type EventRecord } from '../features/events/event.types';

export const EventDetails = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const navigate = useNavigate();
	const [event, setEvent] = useState<EventRecord | null>(null);
	const [error, setError] = useState('');
	const [copied, setCopied] = useState(false);
	const isSignedIn = Boolean(localStorage.getItem('token'));
	let role: string | undefined;
	try {
		role = JSON.parse(localStorage.getItem('user') || '{}').role;
	} catch {
		role = undefined;
	}
	const canBuy = role === 'eventee';

	useEffect(() => {
		api.get(`/events/${eventId}`).then((response) => setEvent(response.data.data)).catch((err) => setError(err.response?.data?.message || 'This event could not be found.'));
	}, [eventId]);

	const share = async () => {
		if (!event) return;
		try {
			if (navigator.share) {
				await navigator.share({ title: event.title, text: event.description, url: window.location.href });
				return;
			}
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
		} catch {
			// Closing the native share sheet does not require an error message.
		}
	};

	if (error) return <div className='grid min-h-screen place-items-center bg-canvas p-5'><div className='max-w-md border border-line bg-white p-8 text-center'><h1 className='text-2xl font-bold text-ink'>Event unavailable</h1><p className='mt-3 text-slate-600'>{error}</p><Link to='/' className='mt-6 inline-flex font-bold text-primary'>Back home</Link></div></div>;
	if (!event) return <div className='grid min-h-screen place-items-center bg-canvas text-slate-600'>Loading event…</div>;

	const remaining = Math.max(event.capacity - event.ticketsSold, 0);
	return (
		<div className='min-h-screen bg-canvas'>
			<header className='border-b border-line bg-white'>
				<div className='mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8'>
					<Link to='/' className='flex items-center gap-2 text-lg font-bold text-ink'><span className='grid size-9 place-items-center rounded-lg bg-primary text-white'><TicketCheck size={19} /></span>Eventful</Link>
					<Link to={isSignedIn ? '/events' : '/'} className='flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ink'><ArrowLeft size={17} />Back</Link>
				</div>
			</header>
			<main className='mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_22rem] lg:py-16'>
				<article className='border border-line bg-white p-6 sm:p-10'>
					<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>{formatPrice(event.price)}</p>
					<h1 className='mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.035em] text-ink sm:text-6xl'>{event.title}</h1>
					<p className='mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-600'>{event.description}</p>
					{event.creator?.name && <p className='mt-8 text-sm text-slate-500'>Hosted by <strong className='text-ink'>{event.creator.name}</strong></p>}
				</article>
				<aside className='h-fit border border-line bg-white p-6 lg:sticky lg:top-6'>
					<div className='space-y-5 text-sm text-slate-600'>
						<p className='flex gap-3'><CalendarDays className='shrink-0 text-primary' size={20} /><span><strong className='block text-ink'>{formatEventDate(event.date)}</strong>{formatEventTime(event.date)}</span></p>
						<p className='flex gap-3'><MapPin className='shrink-0 text-primary' size={20} /><span><strong className='block text-ink'>Location</strong>{event.location}</span></p>
						<p className='flex gap-3'><Users className='shrink-0 text-primary' size={20} /><span><strong className='block text-ink'>{remaining} {remaining === 1 ? 'place' : 'places'} left</strong>{event.ticketsSold} attending</span></p>
					</div>
					<div className='mt-7 border-t border-line pt-6'>
						<Button onClick={() => navigate(!isSignedIn ? '/login' : canBuy ? `/checkout/${eventId}` : '/dashboard')} disabled={remaining === 0} className='w-full'>{remaining === 0 ? 'Sold out' : !isSignedIn ? 'Log in to get a ticket' : canBuy ? 'Get ticket' : 'Open creator dashboard'}</Button>
						<Button variant='secondary' onClick={share} className='mt-3 w-full'><Share2 size={17} />{copied ? 'Link copied' : 'Share event'}</Button>
					</div>
				</aside>
			</main>
		</div>
	);
};
