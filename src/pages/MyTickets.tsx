import { Bell, CalendarDays, MapPin, QrCode, TicketCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { formatEventDate, formatEventTime, type EventRecord } from '../features/events/event.types';
import { getMyTickets, setTicketReminder } from '../features/tickets/tickets.service';

interface TicketRecord {
	id?: string;
	_id?: string;
	qrCodeUrl: string;
	scannedAt?: string | null;
	isScanned?: boolean;
	paymentReference?: string;
	payment?: { reference?: string } | null;
	event: EventRecord;
}

export const MyTickets = () => {
	const [tickets, setTickets] = useState<TicketRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [reminderDelay, setReminderDelay] = useState<Record<string, string>>({});
	const [settingReminder, setSettingReminder] = useState<string | null>(null);
	const [reminderMessage, setReminderMessage] = useState<Record<string, { text: string; type: 'success' | 'error' }>>({});

	useEffect(() => {
		getMyTickets()
			.then(setTickets)
			.catch((err) => setError(err.response?.data?.message || 'We could not load your tickets.'))
			.finally(() => setIsLoading(false));
	}, []);

	const setReminder = async (ticketId: string) => {
		setSettingReminder(ticketId);
		try {
			const response = await setTicketReminder(ticketId, Number(reminderDelay[ticketId] || 24));
			setReminderMessage((current) => ({ ...current, [ticketId]: { text: `Reminder set for ${new Date(response.data.scheduledFor).toLocaleString('en-NG')}`, type: 'success' } }));
		} catch (err: unknown) {
			const failure = err as { response?: { data?: { message?: string } } };
			setReminderMessage((current) => ({ ...current, [ticketId]: { text: failure.response?.data?.message || 'Could not set this reminder.', type: 'error' } }));
		} finally {
			setSettingReminder(null);
		}
	};

	if (isLoading) return <div className='border border-line bg-white px-6 py-16 text-center text-slate-600'>Loading tickets…</div>;

	return (
		<div>
			<div className='border-b border-line pb-8'>
				<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Your passes</p>
				<h1 className='mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl'>My tickets</h1>
				<p className='mt-3 text-slate-600'>Keep your QR code ready when you arrive.</p>
			</div>

			{error ? (
				<div role='alert' className='mt-8 border-l-4 border-red-600 bg-red-50 px-5 py-4 text-red-800'>{error}</div>
			) : tickets.length === 0 ? (
				<div className='mt-8 border border-line bg-white px-6 py-16 text-center'>
					<TicketCheck className='mx-auto text-primary' size={34} />
					<h2 className='mt-5 text-xl font-bold text-ink'>No tickets yet</h2>
					<p className='mt-2 text-slate-600'>Your booked events will appear here.</p>
				</div>
			) : (
				<div className='mt-8 grid gap-6 xl:grid-cols-2'>
					{tickets.map((ticket) => {
						const id = ticket.id ?? ticket._id ?? '';
						const scanned = Boolean(ticket.scannedAt || ticket.isScanned);
						const isFuture = new Date(ticket.event.date) > new Date();
						const reference = ticket.payment?.reference ?? ticket.paymentReference;
						return (
							<article key={id} className='grid overflow-hidden border border-line bg-white sm:grid-cols-[12rem_1fr]'>
								<div className='flex flex-col items-center justify-center border-b border-line bg-slate-50 p-6 sm:border-b-0 sm:border-r'>
									<div className='border border-line bg-white p-2'><img src={ticket.qrCodeUrl} alt={`QR code for ${ticket.event.title}`} className='size-32 object-contain' /></div>
									<span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${scanned ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>
										<QrCode size={14} />{scanned ? 'Used' : 'Valid entry'}
									</span>
									{reference && <p className='mt-3 max-w-36 truncate font-mono text-xs text-slate-400' title={reference}>Ref · {reference.slice(-8)}</p>}
								</div>
								<div className='flex flex-col p-6'>
									<h2 className='text-2xl font-bold leading-tight text-ink'>{ticket.event.title}</h2>
									<div className='mt-5 space-y-3 text-sm text-slate-600'>
										<p className='flex gap-3'><CalendarDays className='shrink-0 text-primary' size={18} /><span>{formatEventDate(ticket.event.date)} · {formatEventTime(ticket.event.date)}</span></p>
										<p className='flex gap-3'><MapPin className='shrink-0 text-primary' size={18} /><span>{ticket.event.location}</span></p>
									</div>

									{!scanned && isFuture && (
										<div className='mt-7 border-t border-line pt-5'>
											<label htmlFor={`reminder-${id}`} className='flex items-center gap-2 text-sm font-semibold text-ink'><Bell size={17} />Email reminder</label>
											<div className='mt-3 flex flex-col gap-2 sm:flex-row'>
												<select id={`reminder-${id}`} value={reminderDelay[id] || '24'} onChange={(event) => setReminderDelay((current) => ({ ...current, [id]: event.target.value }))} className='min-h-11 grow rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-primary focus:outline-none'>
													<option value='1'>1 hour before</option><option value='24'>1 day before</option><option value='48'>2 days before</option><option value='168'>1 week before</option>
												</select>
												<Button variant='secondary' onClick={() => setReminder(id)} isLoading={settingReminder === id} loadingText='Setting…'>Set reminder</Button>
											</div>
											{reminderMessage[id] && <p className={`mt-3 text-sm ${reminderMessage[id].type === 'success' ? 'text-primary' : 'text-red-700'}`}>{reminderMessage[id].text}</p>}
										</div>
									)}
								</div>
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
};
