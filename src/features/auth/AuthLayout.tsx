import { MailCheck, ShieldCheck, TicketCheck } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = () => (
	<div className='grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]'>
		<aside className='hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between'>
			<Link to='/' className='flex items-center gap-3 text-xl font-bold'>
				<span className='grid size-10 place-items-center rounded-xl bg-primary'><TicketCheck size={21} /></span>
				Eventful
			</Link>
			<div className='max-w-lg'>
				<p className='text-sm font-bold uppercase tracking-[0.18em] text-emerald-300'>A better way in</p>
				<h1 className='mt-5 text-5xl font-bold leading-[1.04] tracking-[-0.04em]'>Good events should be easy to join.</h1>
				<div className='mt-10 grid gap-5 border-t border-white/15 pt-8 text-slate-300'>
					<p className='flex items-center gap-3'><ShieldCheck className='text-emerald-300' size={21} />Secure payments and one-time QR tickets</p>
					<p className='flex items-center gap-3'><MailCheck className='text-emerald-300' size={21} />Email-verified accounts</p>
				</div>
			</div>
			<p className='text-sm text-slate-500'>Eventful · Ticketing for memorable gatherings</p>
		</aside>

		<main className='flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-16'>
			<div className='flex items-center justify-between lg:justify-end'>
				<Link to='/' className='flex items-center gap-2 text-lg font-bold text-ink lg:hidden'>
					<span className='grid size-9 place-items-center rounded-lg bg-primary text-white'><TicketCheck size={19} /></span>
					Eventful
				</Link>
				<Link to='/' className='text-sm font-semibold text-slate-500 hover:text-ink'>Back home</Link>
			</div>
			<div className='my-auto flex w-full justify-center py-12'>
				<Outlet />
			</div>
		</main>
	</div>
);
