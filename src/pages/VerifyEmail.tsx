import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

export const VerifyEmail: React.FC = () => {
	const { token } = useParams<{ token: string }>();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const [message, setMessage] = useState('Verifying your email...');

	const hasFetched = useRef(false);

	useEffect(() => {
		const verifyAccount = async () => {
			// If we already fetched, stop immediately
			if (hasFetched.current) return;
			hasFetched.current = true;
			try {
				// Hit the new backend endpoint
				const response = await api.get(`/auth/verify-email/${token}`);
				setStatus('success');
				setMessage(response.data.message);
			} catch (error: any) {
				setStatus('error');
				setMessage(error.response?.data?.message || 'Verification failed');
			}
		};

		if (token) {
			verifyAccount();
		}
	}, [token]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
			<div className='w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md'>
				{status === 'loading' && (
					<div className='text-xl font-bold text-gray-700 animate-pulse'>
						Verifying...
					</div>
				)}

				{status === 'success' && (
					<div>
						<div className='flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full'>
							<span className='text-3xl'>✅</span>
						</div>
						<h2 className='mb-2 text-2xl font-bold text-green-700'>
							Account Verified!
						</h2>
						<p className='mb-6 text-gray-600'>{message}</p>
						<Link to='/login'>
							<Button className='w-full'>Proceed to Login</Button>
						</Link>
					</div>
				)}

				{status === 'error' && (
					<div>
						<div className='flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full'>
							<span className='text-3xl'>❌</span>
						</div>
						<h2 className='mb-2 text-2xl font-bold text-red-700'>
							Verification Failed
						</h2>
						<p className='mb-6 text-red-600'>{message}</p>
						<Link to='/register'>
							<Button
								variant='secondary'
								className='w-full'
							>
								Back to Registration
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
