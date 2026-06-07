import React, { useEffect, useState } from 'react';
import {
	getMyTickets,
	setTicketReminder,
} from '../features/tickets/tickets.service';
import { Button } from '../components/ui/Button';

export const MyTickets: React.FC = () => {
	const [tickets, setTickets] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	// State for managing reminders
	const [reminderDelay, setReminderDelay] = useState<Record<string, string>>(
		{},
	);
	const [settingReminder, setSettingReminder] = useState<string | null>(null);
	const [reminderMessage, setReminderMessage] = useState<
		Record<string, { text: string; type: 'success' | 'error' }>
	>({});

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const data = await getMyTickets();
				setTickets(data);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Failed to load tickets');
			} finally {
				setIsLoading(false);
			}
		};
		fetchTickets();
	}, []);

	const handleSetReminder = async (ticketId: string) => {
		const delay = Number(reminderDelay[ticketId] || '24');
		setSettingReminder(ticketId);

		try {
			const res = await setTicketReminder(ticketId, delay);
			const scheduledDate = new Date(res.data.scheduledFor).toLocaleString();
			setReminderMessage({
				...reminderMessage,
				[ticketId]: { text: `Scheduled for ${scheduledDate}`, type: 'success' },
			});
		} catch (err: any) {
			setReminderMessage({
				...reminderMessage,
				[ticketId]: {
					text: err.response?.data?.message || 'Failed to schedule',
					type: 'error',
				},
			});
		} finally {
			setSettingReminder(null);
		}
	};

	if (isLoading)
		return (
			<div className='flex justify-center items-center h-64 font-medium text-gray-500 animate-pulse'>
				Loading your tickets...
			</div>
		);
	if (error)
		return (
			<div className='text-center text-red-500 mt-10 p-4 bg-red-50 rounded-lg max-w-lg mx-auto'>
				{error}
			</div>
		);

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
			<h1 className='text-3xl font-extrabold text-gray-900 mb-8 tracking-tight'>
				My Tickets
			</h1>

			{tickets.length === 0 ? (
				<div className='text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100'>
					<span className='text-5xl mb-4 block'>🎫</span>
					<h3 className='text-xl font-bold text-gray-800'>No tickets yet!</h3>
					<p className='text-gray-500 mt-2'>
						Explore events and grab your first ticket.
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{tickets.map((ticket) => (
						<div
							key={ticket._id}
							className='flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md'
						>
							{/* QR Code Section */}
							<div className='bg-gray-50 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200 min-w-[200px]'>
								<img
									src={ticket.qrCodeUrl}
									alt='Ticket QR'
									className='w-32 h-32 object-contain bg-white p-2 rounded-lg shadow-sm mb-3'
								/>
								<span
									className={`px-3 py-1 text-xs font-bold rounded-full ${ticket.isScanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
								>
									{ticket.isScanned ? 'SCANNED / USED' : 'VALID ENTRY'}
								</span>
								<p
									className='text-[10px] text-gray-400 mt-2 font-mono uppercase truncate w-32 text-center'
									title={ticket.paymentReference}
								>
									Ref: {ticket.paymentReference.slice(-8)}
								</p>
							</div>

							{/* Details Section */}
							<div className='p-6 flex-grow flex flex-col justify-between'>
								<div>
									<h3 className='text-xl font-bold text-gray-900 mb-1'>
										{ticket.event.title}
									</h3>
									<p className='text-sm text-gray-500 mb-4 line-clamp-2'>
										{ticket.event.description}
									</p>

									<div className='space-y-2 mb-6 text-sm text-gray-700'>
										<div className='flex items-center gap-2'>
											<span>📅</span>{' '}
											{new Date(ticket.event.date).toLocaleString()}
										</div>
										<div className='flex items-center gap-2'>
											<span>📍</span> {ticket.event.location}
										</div>
									</div>
								</div>

								{/* Reminder Controls */}
								{!ticket.isScanned &&
									new Date(ticket.event.date) > new Date() && (
										<div className='pt-4 border-t border-gray-100'>
											<label className='text-xs font-bold text-gray-600 mb-2 block uppercase tracking-wider'>
												Email Reminder
											</label>
											<div className='flex gap-2'>
												<select
													className='text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary block w-full bg-gray-50'
													value={reminderDelay[ticket._id] || '24'}
													onChange={(e) =>
														setReminderDelay({
															...reminderDelay,
															[ticket._id]: e.target.value,
														})
													}
												>
													<option value='1'>1 Hour Before</option>
													<option value='24'>1 Day Before</option>
													<option value='48'>2 Days Before</option>
												</select>
												<Button
													variant='secondary'
													className='text-xs px-4'
													onClick={() => handleSetReminder(ticket._id)}
													isLoading={settingReminder === ticket._id}
												>
													Set
												</Button>
											</div>
											{reminderMessage[ticket._id] && (
												<p
													className={`text-xs mt-2 font-medium ${reminderMessage[ticket._id].type === 'success' ? 'text-green-600' : 'text-red-600'}`}
												>
													{reminderMessage[ticket._id].text}
												</p>
											)}
										</div>
									)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
