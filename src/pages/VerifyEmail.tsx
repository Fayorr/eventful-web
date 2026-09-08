import { CheckCircle2, MailCheck, RefreshCw, TicketCheck, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { resendVerification } from '../features/auth/auth.service';

export const VerifyEmail = () => {
	const [searchParams] = useSearchParams();
	const email = searchParams.get('email') ?? '';
	const isPending = searchParams.get('pending') === '1';
	const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
	const errorMessage = searchParams.get('error_description') ?? hashParams.get('error_description');
	const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

	const resend = async () => {
		if (!email) return;
		setResendState('sending');
		try {
			await resendVerification(email);
			setResendState('sent');
		} catch {
			setResendState('error');
		}
	};

	const status = errorMessage ? 'error' : isPending ? 'pending' : 'confirmed';

	return (
		<div className='min-h-screen bg-canvas px-5 py-8'>
			<header className='mx-auto flex max-w-5xl justify-center'>
				<Link to='/' className='flex items-center gap-2 text-lg font-bold text-ink'><span className='grid size-9 place-items-center rounded-lg bg-primary text-white'><TicketCheck size={19} /></span>Eventful</Link>
			</header>
			<main className='mx-auto mt-14 max-w-xl border border-line bg-white p-7 text-center sm:p-10'>
				{status === 'pending' && <MailCheck className='mx-auto text-primary' size={54} />}
				{status === 'confirmed' && <CheckCircle2 className='mx-auto text-primary' size={54} />}
				{status === 'error' && <XCircle className='mx-auto text-red-700' size={54} />}
				<p className={`mt-6 text-sm font-bold uppercase tracking-[0.16em] ${status === 'error' ? 'text-red-700' : 'text-primary'}`}>Email verification</p>
				<h1 className='mt-3 text-3xl font-bold text-ink'>{status === 'pending' ? 'Check your inbox' : status === 'confirmed' ? 'Email confirmed' : 'Link unavailable'}</h1>
				<p className='mt-4 leading-7 text-slate-600'>
					{status === 'pending' && <>We sent a confirmation link{email ? <> to <strong className='text-ink'>{email}</strong></> : ''}. Open it before you log in.</>}
					{status === 'confirmed' && 'Your account is verified. You can now log in to Eventful.'}
					{status === 'error' && (errorMessage || 'This confirmation link is invalid or has expired.')}
				</p>

				{status === 'pending' && email && (
					<div className='mt-8 border-t border-line pt-6'>
						<Button variant='secondary' onClick={resend} isLoading={resendState === 'sending'} loadingText='Sending…' className='w-full'><RefreshCw size={17} />Resend confirmation</Button>
						{resendState === 'sent' && <p className='mt-3 text-sm text-primary'>A new confirmation email has been sent.</p>}
						{resendState === 'error' && <p className='mt-3 text-sm text-red-700'>We could not resend the email. Try again shortly.</p>}
					</div>
				)}

				<Link to='/login' className='mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark'>Go to login</Link>
			</main>
		</div>
	);
};
