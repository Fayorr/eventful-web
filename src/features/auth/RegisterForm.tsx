import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { register } from './auth.service';
import { Eye, EyeClosed,  } from 'lucide-react';

export const RegisterForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'eventee',
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await register(formData);
			localStorage.setItem('token', result.data.token);
			localStorage.setItem('user', JSON.stringify(result.data.user));

			if (result.data.user.role === 'creator') {
				navigate('/dashboard');
			} else {
				navigate('/events');
			}
		} catch (err: unknown) {
			const error = err as { response?: { data?: { message?: string } } };
			setError(error.response?.data?.message || 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'
		>
			<h2 className='mb-3 text-2xl font-bold text-center text-dark'>
				Create an Account
			</h2>
			{error && (
				<div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md wrap-break-word'>
					{error}
				</div>
			)}{' '}
			<Input
				label='Full Name'
				name='name'
				value={formData.name}
				onChange={handleChange}
				required
			/>
			<Input
				label='Email Address'
				type='email'
				name='email'
				value={formData.email}
				onChange={handleChange}
				required
			/>
			<div className='flex flex-col mb-6'>
				<label className='mb-1 text-sm font-medium text-gray-700'>
					Password
				</label>
				<div className=' relative flex align-center'>
					<input
						type={showPassword ? 'text' : 'password'}
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
						className='w-full flex px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors '
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none flex'
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
					</button>
				</div>
			</div>
			<div className='flex flex-col mb-6'>
				<label className='mb-1 text-sm font-medium text-gray-700'>
					I am a...
				</label>
				<select
					name='role'
					value={formData.role}
					onChange={handleChange}
					className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
				>
					<option value='eventee'>Ticket Buyer (Eventee)</option>
					<option value='creator'>Event Creator</option>
				</select>
			</div>
			<Button
				type='submit'
				variant='primary'
				isLoading={isLoading}
				className='w-full'
			>
				Sign Up
			</Button>
			<p className='mt-4 text-sm text-center text-gray-600'>
				Already have an account?{' '}
				<Link
					to='/login'
					className='text-primary hover:underline'
				>
					Log in
				</Link>
			</p>
		</form>
	);
};
