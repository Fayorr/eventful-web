import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; // Assuming you created this earlier
import { login } from './auth.service';

export const LoginForm: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const result = await login({ email, password });

			// Save auth data
			localStorage.setItem('token', result.data.token);
			localStorage.setItem('user', JSON.stringify(result.data.user));

			// Redirect based on role
			if (result.data.user.role === 'creator') {
				navigate('/dashboard');
			} else {
				navigate('/events');
			}
		} catch (err: unknown) {
			const error = err as { response?: { data?: { message?: string } } };
			setError(error.response?.data?.message || 'Failed to login');
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
			<Input
				label='Password'
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<Button
				type='submit'
				variant='primary'
				isLoading={isLoading}
				className='w-full mt-4'
			>
				Sign In
			</Button>
		</form>
	);
};
