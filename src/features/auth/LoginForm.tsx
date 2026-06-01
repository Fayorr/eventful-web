import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; // Assuming you created this earlier
import { login } from './auth.service';
import { Eye, EyeClosed } from 'lucide-react';

export const LoginForm: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await login({ email, password });
			console.log('Login response:', result);

			// The response structure is { status: 'success', data: { user, token, expiresAt } }
			const token = result.data?.token;
			const user = result.data?.user;

			if (!token || !user) {
				throw new Error('Invalid response from server');
			}

			// Save auth data
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			// Redirect based on role
			if (user.role === 'creator') {
				navigate('/dashboard');
			} else {
				navigate('/events');
			}
		} catch (err: unknown) {
			const error = err as {
				response?: { data?: { message?: string }; status?: number };
				message?: string;
			};
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Failed to login. Please check your credentials and try again.';
			setError(errorMessage);
			console.error('Login error:', error);
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
				Welcome Back
			</h2>
			{error && (
				<div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md wrap-break-word'>
					{error}
				</div>
			)}{' '}
			<Input
				label='Email Address'
				type='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<div className='flex flex-col mb-6'>
				<label className='mb-1 text-sm font-medium text-gray-700'>
					Password
				</label>
				<div className='relative flex align-center'>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none'
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
					</button>
				</div>
			</div>
			<Button
				type='submit'
				variant='primary'
				isLoading={isLoading}
				className='w-full mt-4'
			>
				Sign In
			</Button>
			<Button
				type='button'
				variant='secondary'
				className='w-full mt-2'
				onClick={() => navigate('/register')}
			>
				Create Account
			</Button>
		</form>
	);
};
