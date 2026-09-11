import { CalendarRange, CheckCircle2, Plus, Ticket, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';
import { getCreatorAnalytics, getPaymentHistory } from '../features/dashboard/dashboard.service';

interface Analytics {
	totalEvents: number;
	totalTicketsSold: number;
	totalAttendees: number;
	attendanceRate: number;
	totalRevenue: number;
}

interface Transaction {
	id?: string;
	_id?: string;
	amount?: number;
	status?: string;
	paidAt?: string;
	createdAt: string;
	event?: { title: string };
	eventee?: { name?: string; email: string };
}

interface PaymentLedger {
	totalRevenue: number;
	transactionCount: number;
	transactions: Transaction[];
}

const money = (amount = 0) =>
	new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		maximumFractionDigits: 0,
	}).format(amount);

export const CreatorDashboard = () => {
	const [analytics, setAnalytics] = useState<Analytics | null>(null);
	const [ledger, setLedger] = useState<PaymentLedger | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		Promise.all([getCreatorAnalytics(), getPaymentHistory()])
			.then(([analyticsResponse, ledgerResponse]) => {
				setAnalytics(analyticsResponse.data);
				setLedger(ledgerResponse.data);
			})
			.catch((err) => setError(err.response?.data?.message || 'We could not load your dashboard.'))
			.finally(() => setIsLoading(false));
	}, []);

	const stats = [
		{ label: 'Revenue', value: money(ledger?.totalRevenue ?? analytics?.totalRevenue), icon: WalletCards },
		{ label: 'Events', value: analytics?.totalEvents ?? 0, icon: CalendarRange },
		{ label: 'Tickets sold', value: analytics?.totalTicketsSold ?? 0, icon: Ticket },
		{ label: 'Checked in', value: analytics?.totalAttendees ?? 0, icon: CheckCircle2 },
	];

	return (
		<div>
			<div className='flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end'>
				<div>
					<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Creator overview</p>
					<h1 className='mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl'>Dashboard</h1>
					<p className='mt-3 text-slate-600'>Sales and attendance across all your events.</p>
				</div>
				<Link to='/create-event' className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark'><Plus size={18} />Create event</Link>
			</div>

			{error && <div role='alert' className='mt-8 border-l-4 border-red-600 bg-red-50 px-5 py-4 text-red-800'>{error}</div>}

			<div className='mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4' aria-busy={isLoading}>
				{isLoading && <span className='sr-only' role='status'>Loading dashboard totals</span>}
				{stats.map(({ label, value, icon: Icon }) => (
					<div key={label} className='bg-white p-6'>
						<div className='flex items-center justify-between gap-5'><span className='text-sm font-semibold text-slate-500'>{label}</span><Icon size={19} className='text-primary' /></div>
						{isLoading ? <Skeleton className='mt-7 h-9 w-24 rounded' /> : <p className='mt-7 text-3xl font-bold tracking-tight text-ink'>{value}</p>}
					</div>
				))}
			</div>

			<section className='mt-10'>
				<div className='mb-4 flex items-center justify-between gap-4'>
					<h2 className='text-2xl font-bold text-ink'>Recent payments</h2>
					{isLoading ? <Skeleton className='h-5 w-16 rounded' /> : <p className='text-sm text-slate-500'>{ledger?.transactionCount ?? 0} total</p>}
				</div>
				<div className='overflow-x-auto border border-line bg-white' aria-busy={isLoading}>
					<table className='min-w-full border-collapse text-left'>
						<thead className='border-b border-line bg-slate-50 text-sm text-slate-500'>
							<tr><th className='px-5 py-4 font-semibold'>Event</th><th className='px-5 py-4 font-semibold'>Buyer</th><th className='px-5 py-4 font-semibold'>Amount</th><th className='px-5 py-4 font-semibold'>Date</th></tr>
						</thead>
						<tbody className='divide-y divide-line text-sm'>
							{isLoading ? Array.from({ length: 3 }, (_, index) => (
								<tr key={index}>
									{Array.from({ length: 4 }, (__, cellIndex) => (
										<td key={cellIndex} className='px-5 py-5'><Skeleton className={`h-4 rounded ${cellIndex === 1 ? 'w-40' : 'w-24'}`} /></td>
									))}
								</tr>
							)) : ledger?.transactions?.length ? ledger.transactions.map((transaction) => (
								<tr key={transaction.id ?? transaction._id} className='hover:bg-slate-50'>
									<td className='whitespace-nowrap px-5 py-4 font-semibold text-ink'>{transaction.event?.title ?? 'Event'}</td>
									<td className='px-5 py-4 text-slate-600'><span className='block font-medium text-ink'>{transaction.eventee?.name ?? 'Attendee'}</span>{transaction.eventee?.email}</td>
									<td className='whitespace-nowrap px-5 py-4 font-semibold text-primary'>{money(transaction.amount)}</td>
									<td className='whitespace-nowrap px-5 py-4 text-slate-600'>{new Date(transaction.paidAt ?? transaction.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</td>
								</tr>
							)) : (
								<tr><td colSpan={4} className='px-5 py-14 text-center text-slate-500'>Payments will appear here after your first ticket sale.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};
