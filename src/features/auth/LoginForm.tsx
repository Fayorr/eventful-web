import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { login } from './auth.service';

export const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await login({ email, password });
			const session = result.data;
			if (!session?.token || !session?.user) throw new Error('The server returned an invalid session.');

			localStorage.setItem('token', session.token);
			localStorage.setItem('user', JSON.stringify(session.user));
			if (session.refreshToken) localStorage.setItem('refreshToken', session.refreshToken);
			navigate(session.user.role === 'creator' ? '/dashboard' : '/events');
		} catch (err: unknown) {
			const failure = err as { response?: { data?: { message?: string } }; message?: string };
			setError(failure.response?.data?.message || failure.message || 'Unable to log in. Try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='w-full max-w-md' noValidate>
			<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Welcome back</p>
			<h2 className='mt-3 text-4xl font-bold tracking-tight text-ink'>Log in to Eventful</h2>
			<p className='mt-3 text-base leading-7 text-slate-600'>Your events, tickets, and dashboard are waiting.</p>

			{error && <div role='alert' className='mt-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800'>{error}</div>}

			<div className='mt-8 grid gap-5'>
				<Input
					label='Email address'
					type='email'
					autoComplete='email'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>
				<div className='grid gap-2'>
					<label htmlFor='login-password' className='text-sm font-semibold text-slate-700'>Password</label>
					<div className='relative'>
						<input
							id='login-password'
							type={showPassword ? 'text' : 'password'}
							autoComplete='current-password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							className='min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base focus:border-primary focus:outline-none'
						/>
						<button type='button' onClick={() => setShowPassword((value) => !value)} className='absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500 hover:text-ink' aria-label={showPassword ? 'Hide password' : 'Show password'}>
							{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
						</button>
					</div>
				</div>
				<Button type='submit' isLoading={isLoading} loadingText='Logging in…' className='mt-2 w-full'>Log in</Button>
			</div>

			<p className='mt-7 text-center text-sm text-slate-600'>
				New to Eventful? <Link to='/register' className='font-bold text-primary hover:text-primary-dark'>Create an account</Link>
			</p>
		</form>
	);
};
