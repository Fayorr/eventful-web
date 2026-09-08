import { CheckCircle2, ScanLine, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

export const ScanTicket = () => {
	const { reference } = useParams<{ reference: string }>();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [message, setMessage] = useState('Checking this ticket…');
	const started = useRef(false);

	useEffect(() => {
		if (started.current || !reference) return;
		started.current = true;
		api.post(`/tickets/scan/${reference}`)
			.then((response) => {
				setStatus('success');
				setMessage(response.data.message);
			})
			.catch((error) => {
				setStatus('error');
				setMessage(error.response?.data?.message || 'This ticket could not be verified.');
			});
	}, [reference]);

	return (
		<div className={`mx-auto max-w-xl border bg-white p-7 text-center sm:p-10 ${status === 'error' ? 'border-red-200' : 'border-line'}`}>
			{status === 'loading' && <ScanLine className='mx-auto text-primary' size={52} />}
			{status === 'success' && <CheckCircle2 className='mx-auto text-primary' size={56} />}
			{status === 'error' && <XCircle className='mx-auto text-red-700' size={56} />}
			<p className={`mt-6 text-sm font-bold uppercase tracking-[0.16em] ${status === 'error' ? 'text-red-700' : 'text-primary'}`}>Ticket scan</p>
			<h1 className='mt-3 text-3xl font-bold text-ink'>{status === 'loading' ? 'Verifying entry' : status === 'success' ? 'Ticket accepted' : 'Entry denied'}</h1>
			<p className='mt-3 leading-7 text-slate-600'>{message}</p>
			<Button className='mt-8 w-full' variant={status === 'error' ? 'secondary' : 'primary'} onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
		</div>
	);
};
