import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	getCreatorAnalytics,
	getPaymentHistory,
} from '../features/dashboard/dashboard.service';

interface Analytics {
	totalTicketsSold: number;
	totalAttendees: number;
}

interface Transaction {
	_id: string;
	amount?: number;
	date?: string;
	status?: string;
	event?: { title: string; price: number };
	eventee?: { email: string };
	createdAt: string;
}

interface PaymentLedger {
	totalRevenue: number;
	transactionCount: number;
	transactions: Transaction[];
}

export const CreatorDashboard: React.FC = () => {
	const [analytics, setAnalytics] = useState<Analytics | null>(null);
	const [ledger, setLedger] = useState<PaymentLedger | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [analyticsRes, ledgerRes] = await Promise.all([
					getCreatorAnalytics(),
					getPaymentHistory(),
				]);
				setAnalytics(analyticsRes.data);
				setLedger(ledgerRes.data);
			} catch (error) {
				console.error('Failed to load dashboard data', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (isLoading)
		return <div className='text-center py-10'>Loading your dashboard...</div>;

	return (
		<div>
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-3xl font-bold text-dark'>Creator Dashboard</h1>
				<Link
					to='/create-event'
					className='px-4 py-2 font-medium border-2 text-white transition-colors rounded-md bg-emerald-500 hover:bg-white hover:text-emerald-500 hover:border-2 hover:border-emerald-600'
				>
					+ Create Event
				</Link>
			</div>

			{/* Analytics Top Cards */}
			<div className='grid grid-cols-1 gap-6 mb-10 sm:grid-cols-3'>
				<div className='p-6 bg-white border-l-4 rounded-lg shadow-sm border-primary'>
					<h3 className='text-sm font-medium text-gray-500'>Total Revenue</h3>
					<p className='mt-2 text-3xl font-extrabold text-dark'>
						₦{ledger?.totalRevenue.toLocaleString() || 0}
					</p>
				</div>
				<div className='p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm'>
					<h3 className='text-sm font-medium text-gray-500'>Tickets Sold</h3>
					<p className='mt-2 text-3xl font-extrabold text-dark'>
						{analytics?.totalTicketsSold || 0}
					</p>
				</div>
				<div className='p-6 bg-white border-l-4 border-purple-500 rounded-lg shadow-sm'>
					<h3 className='text-sm font-medium text-gray-500'>
						Attendees Scanned
					</h3>
					<p className='mt-2 text-3xl font-extrabold text-dark'>
						{analytics?.totalAttendees || 0}
					</p>
				</div>
			</div>

			{/* Payment Ledger Table */}
			<h2 className='mb-4 text-xl font-bold text-dark'>Recent Transactions</h2>
			<div className='overflow-hidden bg-white rounded-lg shadow'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
								Event
							</th>
							<th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
								Buyer
							</th>
							<th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
								Amount
							</th>
							<th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>
								Date
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{ledger?.transactions.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className='px-6 py-4 text-sm text-center text-gray-500'
								>
									No transactions yet.
								</td>
							</tr>
						) : (
							ledger?.transactions.map((tx: Transaction) => (
								<tr key={tx._id}>
									<td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
										{tx.event?.title}
									</td>
									<td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
										{tx.eventee?.email}
									</td>
									<td className='px-6 py-4 text-sm font-bold text-green-600 whitespace-nowrap'>
										₦{tx.event?.price.toLocaleString()}
									</td>
									<td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
										{new Date(tx.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
