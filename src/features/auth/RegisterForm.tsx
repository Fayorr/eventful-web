import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { register } from './auth.service';

export const RegisterForm = () => {
	const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'eventee' });
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');
		setIsLoading(true);
		try {
			await register(formData);
			navigate(`/verify-email?pending=1&email=${encodeURIComponent(formData.email)}`);
		} catch (err: unknown) {
			const failure = err as { response?: { data?: { message?: string } }; message?: string };
			setError(failure.response?.data?.message || failure.message || 'Unable to create your account.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='w-full max-w-md'>
			<p className='text-sm font-bold uppercase tracking-[0.16em] text-primary'>Join Eventful</p>
			<h2 className='mt-3 text-4xl font-bold tracking-tight text-ink'>Create your account</h2>
			<p className='mt-3 text-base leading-7 text-slate-600'>We’ll send a confirmation link before your first login.</p>

			{error && <div role='alert' className='mt-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800'>{error}</div>}

			<div className='mt-8 grid gap-5'>
				<Input label='Full name' name='name' autoComplete='name' value={formData.name} onChange={handleChange} required />
				<Input label='Email address' type='email' name='email' autoComplete='email' value={formData.email} onChange={handleChange} required />
				<div className='grid gap-2'>
					<label htmlFor='register-password' className='text-sm font-semibold text-slate-700'>Password</label>
					<div className='relative'>
						<input id='register-password' type={showPassword ? 'text' : 'password'} name='password' autoComplete='new-password' minLength={8} value={formData.password} onChange={handleChange} required className='min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base focus:border-primary focus:outline-none' />
						<button type='button' onClick={() => setShowPassword((value) => !value)} className='absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500 hover:text-ink' aria-label={showPassword ? 'Hide password' : 'Show password'}>
							{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
						</button>
					</div>
					<p className='text-sm text-slate-500'>Use at least 8 characters.</p>
				</div>
				<div className='grid gap-2'>
					<label htmlFor='account-role' className='text-sm font-semibold text-slate-700'>I want to</label>
					<select id='account-role' name='role' value={formData.role} onChange={handleChange} className='min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-base focus:border-primary focus:outline-none'>
						<option value='eventee'>Attend events</option>
						<option value='creator'>Create and manage events</option>
					</select>
				</div>
				<Button type='submit' isLoading={isLoading} loadingText='Creating account…' className='mt-2 w-full'>Create account</Button>
			</div>

			<p className='mt-7 text-center text-sm text-slate-600'>
				Already registered? <Link to='/login' className='font-bold text-primary hover:text-primary-dark'>Log in</Link>
			</p>
		</form>
	);
};
