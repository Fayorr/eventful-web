import {
	ArrowUpRight,
	CalendarDays,
	Copy,
	MapPin,
	Search,
	Share2,
	Users,
	X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import {
	formatEventDate,
	formatEventTime,
	formatPrice,
	getEventId,
	type EventRecord,
} from '../features/events/event.types';

interface ShareLinks {
	whatsapp: string;
	twitter: string;
	facebook: string;
	linkedin: string;
	copyUrl: string;
}

const EventsSkeleton = () => (
	<div className='mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3' aria-busy='true'>
		<span className='sr-only' role='status'>Loading events</span>
		{Array.from({ length: 3 }, (_, index) => (
			<article key={index} className='flex min-h-96 flex-col border border-line bg-white p-6'>
				<div className='flex items-center justify-between gap-4'>
					<Skeleton className='h-6 w-20 rounded-full' />
					<Skeleton className='size-10 rounded-lg' />
				</div>
				<Skeleton className='mt-7 h-7 w-4/5 rounded' />
				<div className='mt-5 space-y-3'>
					<Skeleton className='h-4 w-full rounded' />
					<Skeleton className='h-4 w-11/12 rounded' />
					<Skeleton className='h-4 w-3/5 rounded' />
				</div>
				<div className='mt-auto space-y-3 border-t border-line pt-5'>
					<Skeleton className='h-4 w-3/4 rounded' />
					<Skeleton className='h-4 w-full rounded' />
					<Skeleton className='h-4 w-2/5 rounded' />
				</div>
				<Skeleton className='mt-6 min-h-11 w-full rounded-xl' />
			</article>
		))}
	</div>
);

export const Events = () => {
	const [events, setEvents] = useState<EventRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [shareLinks, setShareLinks] = useState<ShareLinks | null>(null);
	const [shareTitle, setShareTitle] = useState('');
	const [copyMessage, setCopyMessage] = useState('Copy link');
	const [now] = useState(() => Date.now());

	useEffect(() => {
		api
			.get('/events', { params: { upcoming: false, limit: 100 } })
			.then((response) => {
				const payload = response.data?.data;
				setEvents(Array.isArray(payload) ? payload : payload?.items ?? []);
			})
			.catch((err) => setError(err.response?.data?.message || 'We could not load events right now.'))
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const term = query.trim().toLowerCase();
		return term
			? events.filter((event) => `${event.title} ${event.location}`.toLowerCase().includes(term))
			: events;
	}, [events, query]);

	const upcoming = filtered.filter((event) => new Date(event.date).getTime() > now);
	const past = filtered.filter((event) => new Date(event.date).getTime() <= now);

	const openShare = async (event: EventRecord) => {
		try {
			const response = await api.get(`/events/${getEventId(event)}/share`);
			setShareLinks(response.data.data);
			setShareTitle(event.title);
			setCopyMessage('Copy link');
		} catch (err) {
			console.error('Failed to load share links', err);
		}
	};

	const copyLink = async () => {
		if (!shareLinks) return;
		await navigator.clipboard.writeText(shareLinks.copyUrl);
		setCopyMessage('Copied');
	};

	const EventCard = ({ event, ended = false }: { event: EventRecord; ended?: boolean }) => {
		const id = getEventId(event);
		const remaining = Math.max(event.capacity - event.ticketsSold, 0);
		return (
			<article className={`flex min-h-96 flex-col border bg-white p-6 ${ended ? 'border-slate-200 text-slate-500' : 'border-line'}`}>
				<div className='flex items-center justify-between gap-4'>
					<span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${ended ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-primary'}`}>
						{ended ? 'Ended' : formatPrice(event.price)}
					</span>
					<button type='button' onClick={() => openShare(event)} className='grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink' aria-label={`Share ${event.title}`}>
						<Share2 size={18} />
					</button>
				</div>
				<h2 className={`mt-7 text-2xl font-bold leading-tight ${ended ? 'text-slate-700' : 'text-ink'}`}>{event.title}</h2>
				<p className='mt-3 line-clamp-3 text-base leading-7 text-slate-600'>{event.description}</p>
				<div className='mt-auto space-y-3 border-t border-line pt-5 text-sm text-slate-600'>
					<p className='flex items-start gap-3'><CalendarDays className='mt-0.5 shrink-0' size={17} /><span>{formatEventDate(event.date)} · {formatEventTime(event.date)}</span></p>
					<p className='flex items-start gap-3'><MapPin className='mt-0.5 shrink-0' size={17} /><span>{event.location}</span></p>
					{!ended && <p className='flex items-start gap-3'><Users className='mt-0.5 shrink-0' size={17} /><span>{remaining} {remaining === 1 ? 'place' : 'places'} left</span></p>}
				</div>
				<div className='mt-6'>
					{ended ? (
						<span className='inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500'>Event ended</span>
					) : (
						<Link to={`/events/${id}`} className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark'>View event <ArrowUpRight size={17} /></Link>
					)}
				</div>
			</article>
		);
	};

	return (
		<div>
			<div className='flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end'>
				<div>
					<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Discover</p>
					<h1 className='mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl'>Upcoming events</h1>
					<p className='mt-3 max-w-xl text-base text-slate-600'>Find something worth leaving the house for.</p>
				</div>
				<label className='relative block w-full lg:max-w-sm'>
					<span className='sr-only'>Search events</span>
					<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={19} />
					<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Search by event or location' className='min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base focus:border-primary focus:outline-none' />
				</label>
			</div>

			{isLoading ? (
				<EventsSkeleton />
			) : error ? (
				<div role='alert' className='mt-8 border-l-4 border-red-600 bg-red-50 px-5 py-4 text-red-800'>{error}</div>
			) : upcoming.length ? (
				<div className='mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>{upcoming.map((event) => <EventCard key={getEventId(event)} event={event} />)}</div>
			) : (
				<div className='mt-8 border border-line bg-white px-6 py-16 text-center'>
					<h2 className='text-xl font-bold text-ink'>{query ? 'No matching events' : 'Nothing scheduled yet'}</h2>
					<p className='mt-2 text-slate-600'>{query ? 'Try a different event name or location.' : 'Check back soon for new plans.'}</p>
				</div>
			)}

			{past.length > 0 && (
				<section className='mt-16 border-t border-line pt-10'>
					<h2 className='text-2xl font-bold text-ink'>Past events</h2>
					<div className='mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>{past.map((event) => <EventCard key={getEventId(event)} event={event} ended />)}</div>
				</section>
			)}

			{shareLinks && (
				<div className='fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4' role='presentation' onMouseDown={(event) => event.target === event.currentTarget && setShareLinks(null)}>
					<div role='dialog' aria-modal='true' aria-labelledby='share-title' className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
						<div className='flex items-start justify-between gap-5'>
							<div><p className='text-sm font-bold uppercase tracking-wider text-primary'>Share event</p><h2 id='share-title' className='mt-2 text-2xl font-bold text-ink'>{shareTitle}</h2></div>
							<button type='button' onClick={() => setShareLinks(null)} className='grid size-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100' aria-label='Close share dialog'><X size={20} /></button>
						</div>
						<div className='mt-6 grid grid-cols-2 gap-3'>
							<a href={shareLinks.whatsapp} target='_blank' rel='noreferrer' className='rounded-xl border border-line px-4 py-3 text-center text-sm font-semibold text-ink hover:bg-slate-50'>WhatsApp</a>
							<a href={shareLinks.twitter} target='_blank' rel='noreferrer' className='rounded-xl border border-line px-4 py-3 text-center text-sm font-semibold text-ink hover:bg-slate-50'>X / Twitter</a>
							<a href={shareLinks.facebook} target='_blank' rel='noreferrer' className='rounded-xl border border-line px-4 py-3 text-center text-sm font-semibold text-ink hover:bg-slate-50'>Facebook</a>
							<a href={shareLinks.linkedin} target='_blank' rel='noreferrer' className='rounded-xl border border-line px-4 py-3 text-center text-sm font-semibold text-ink hover:bg-slate-50'>LinkedIn</a>
						</div>
						<Button onClick={copyLink} className='mt-4 w-full'><Copy size={17} />{copyMessage}</Button>
					</div>
				</div>
			)}
		</div>
	);
};
