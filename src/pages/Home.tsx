import { useEffect, useState } from 'react';
import {
	ArrowRight,
	BarChart3,
	CalendarDays,
	MapPin,
	QrCode,
	TicketCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { formatPrice, getEventId, type EventRecord } from '../features/events/event.types';

export const Home = () => {
	const [events, setEvents] = useState<EventRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		api
			.get('/events', { params: { upcoming: true, limit: 3 } })
			.then((response) => {
				const payload = response.data?.data;
				setEvents(Array.isArray(payload) ? payload : payload?.items ?? []);
			})
			.catch(() => setEvents([]))
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<div className='min-h-screen bg-white'>
			<header className='border-b border-line bg-white'>
				<div className='mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8'>
					<Link
						to='/'
						className='flex items-center gap-2 text-xl font-bold tracking-tight text-ink'
					>
						<span className='grid size-9 place-items-center rounded-xl bg-primary text-white'>
							<TicketCheck size={20} strokeWidth={2.2} />
						</span>
						Eventful
					</Link>
					<nav aria-label='Public navigation' className='flex items-center gap-2 sm:gap-4'>
						<Link
							to='/login'
							className='rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100'
						>
							Log in
						</Link>
						<Link to='/register'>
							<Button className='min-h-10 px-4 py-2'>Create account</Button>
						</Link>
					</nav>
				</div>
			</header>

			<main>
				<section className='border-b border-line bg-canvas'>
					<div className='mx-auto grid max-w-7xl gap-12 px-5 py-18 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24'>
						<div className='max-w-3xl'>
							<p className='mb-5 text-sm font-bold uppercase tracking-[0.18em] text-primary'>
								Events worth showing up for
							</p>
							<h1 className='max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl'>
								Find your next good night out.
							</h1>
							<p className='mt-6 max-w-2xl text-lg leading-8 text-slate-600'>
								Browse events, pay securely, and keep every ticket in one place. Hosting? Publish an event and follow sales from your dashboard.
							</p>
							<div className='mt-8 flex flex-col gap-3 sm:flex-row'>
								<Link to='/register'>
									<Button className='w-full sm:w-auto'>
										Explore events <ArrowRight size={17} />
									</Button>
								</Link>
								<Link to='/register'>
									<Button variant='secondary' className='w-full sm:w-auto'>Host an event</Button>
								</Link>
							</div>
						</div>

						<div className='border border-line bg-white p-3 shadow-[0_24px_70px_rgba(18,33,31,0.10)] sm:p-5'>
							<div className='bg-ink p-6 text-white sm:p-8'>
								<div className='flex items-start justify-between gap-6'>
									<div>
										<p className='text-sm font-semibold text-emerald-200'>Your entry is ready</p>
										<p className='mt-2 text-2xl font-bold'>One ticket. No queue drama.</p>
									</div>
									<QrCode className='shrink-0 text-emerald-300' size={48} strokeWidth={1.5} />
								</div>
								<div className='mt-12 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm'>
									<div>
										<span className='block text-slate-400'>Payment</span>
										<strong className='mt-1 block'>Secured by Paystack</strong>
									</div>
									<div>
										<span className='block text-slate-400'>Entry</span>
										<strong className='mt-1 block'>One-time QR scan</strong>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className='mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20'>
					<div className='mb-8 flex items-end justify-between gap-6'>
						<div>
							<p className='text-sm font-bold uppercase tracking-[0.15em] text-primary'>Coming up</p>
							<h2 className='mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl'>Make plans.</h2>
						</div>
						<Link
							to='/register'
							className='hidden items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark sm:flex'
						>
							See all events <ArrowRight size={16} />
						</Link>
					</div>

					{isLoading ? (
						<div className='border border-line bg-canvas px-6 py-14 text-center text-slate-600'>Loading upcoming events…</div>
					) : events.length ? (
						<div className='grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3'>
							{events.map((event, index) => (
								<article key={getEventId(event)} className='flex min-h-72 flex-col bg-white p-6'>
									<div className='flex items-center justify-between gap-4'>
										<span className='text-sm font-bold text-primary'>{formatPrice(event.price)}</span>
										<span className='text-sm font-semibold text-slate-400'>0{index + 1}</span>
									</div>
									<h3 className='mt-8 text-2xl font-bold leading-tight text-ink'>{event.title}</h3>
									<p className='mt-3 line-clamp-2 text-base leading-7 text-slate-600'>{event.description}</p>
									<div className='mt-auto space-y-2 border-t border-line pt-5 text-sm text-slate-600'>
										<p className='flex items-center gap-2'><CalendarDays size={16} />{new Date(event.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</p>
										<p className='flex items-center gap-2'><MapPin size={16} /><span className='truncate'>{event.location}</span></p>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className='border border-line bg-canvas px-6 py-14 text-center'>
							<h3 className='text-lg font-bold text-ink'>No events announced yet</h3>
							<p className='mt-2 text-slate-600'>Create an account and be first to know when plans land.</p>
						</div>
					)}
				</section>

				<section className='bg-ink text-white'>
					<div className='mx-auto grid max-w-7xl gap-px bg-white/15 md:grid-cols-3'>
						{[
							{ icon: TicketCheck, title: 'Buy with confidence', text: 'Clear pricing and secure Paystack checkout.' },
							{ icon: QrCode, title: 'Walk straight in', text: 'Your ticket arrives with a one-time QR code.' },
							{ icon: BarChart3, title: 'Know your crowd', text: 'Creators see sales, attendance, and revenue.' },
						].map(({ icon: Icon, title, text }) => (
							<div key={title} className='bg-ink px-6 py-10 sm:px-8'>
								<Icon className='text-emerald-300' size={24} />
								<h3 className='mt-5 text-xl font-bold'>{title}</h3>
								<p className='mt-2 text-base leading-7 text-slate-300'>{text}</p>
							</div>
						))}
					</div>
				</section>
			</main>

			<footer className='border-t border-line bg-white'>
				<div className='mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8'>
					<p>© {new Date().getFullYear()} Eventful</p>
					<p>Ticketing for memorable gatherings.</p>
				</div>
			</footer>
		</div>
	);
};
