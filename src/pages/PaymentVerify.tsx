import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

interface TicketRecord { id?: string; _id?: string; qrCodeUrl: string }

export const PaymentVerify = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const reference = searchParams.get('reference') ?? localStorage.getItem('paystack_reference');
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(reference ? 'loading' : 'error');
	const [message, setMessage] = useState(reference ? 'Confirming your payment with Paystack…' : 'No payment reference was provided.');
	const [ticket, setTicket] = useState<TicketRecord | null>(null);
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		if (!reference) return;
		api.post(`/tickets/verify/${reference}`)
			.then((response) => {
				setTicket(response.data.data);
				setStatus('success');
				setMessage('Your payment is confirmed and your ticket is ready.');
				localStorage.removeItem('paystack_reference');
			})
			.catch((err) => {
				setStatus('error');
				setMessage(err.response?.data?.message || 'We could not verify this payment.');
			});
	}, [reference]);

	return (
		<div className='mx-auto max-w-xl border border-line bg-white p-6 text-center sm:p-10'>
			{status === 'loading' && <><ShieldCheck className='mx-auto text-primary' size={48} /><p className='mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary'>Payment verification</p><h1 className='mt-3 text-3xl font-bold text-ink'>One moment</h1></>}
			{status === 'success' && <><CheckCircle2 className='mx-auto text-primary' size={52} /><p className='mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary'>Payment confirmed</p><h1 className='mt-3 text-3xl font-bold text-ink'>Your ticket is ready</h1></>}
			{status === 'error' && <><XCircle className='mx-auto text-red-700' size={52} /><p className='mt-6 text-sm font-bold uppercase tracking-[0.16em] text-red-700'>Payment issue</p><h1 className='mt-3 text-3xl font-bold text-ink'>Verification failed</h1></>}
			<p className='mx-auto mt-3 max-w-md leading-7 text-slate-600'>{message}</p>

			{ticket && <div className='mx-auto mt-8 w-fit border border-line bg-slate-50 p-4'><img src={ticket.qrCodeUrl} alt='Ticket QR code' className='size-48 bg-white object-contain' /><p className='mt-3 font-mono text-xs text-slate-500'>Ref · {reference?.slice(-10)}</p></div>}

			<div className='mt-8 grid gap-3 sm:grid-cols-2'>
				<Button variant='secondary' onClick={() => navigate('/events')}>Browse events</Button>
				<Button onClick={() => navigate('/my-tickets')}>View my tickets</Button>
			</div>
		</div>
	);
};
