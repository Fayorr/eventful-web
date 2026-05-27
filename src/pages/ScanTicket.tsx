import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

export const ScanTicket: React.FC = () => {
	const { reference } = useParams<{ reference: string }>();
	const navigate = useNavigate();

	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const [message, setMessage] = useState('Verifying ticket...');

	useEffect(() => {
		const verifyScan = async () => {
			try {
				// This request automatically includes the Creator's JWT token
				// because of our Axios interceptor!
				const response = await api.post(`/tickets/scan/${reference}`);

				setStatus('success');
				setMessage(response.data.message);
			} catch (error: any) {
				setStatus('error');
				setMessage(error.response?.data?.message || 'Verification failed');
			}
		};

		if (reference) {
			verifyScan();
		}
	}, [reference]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
			<div className='w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md'>
				{status === 'loading' && (
					<div className='text-xl font-bold text-gray-700 animate-pulse'>
						Scanning Ticket...
					</div>
				)}

				{status === 'success' && (
					<div>
						<div className='flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full'>
							<span className='text-4xl'>✅</span>
						</div>
						<h2 className='mb-2 text-2xl font-bold text-green-700'>
							Valid Ticket!
						</h2>
						<p className='mb-6 text-gray-600'>{message}</p>
					</div>
				)}

				{status === 'error' && (
					<div>
						<div className='flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full'>
							<span className='text-4xl'>❌</span>
						</div>
						<h2 className='mb-2 text-2xl font-bold text-red-700'>
							Invalid Scan
						</h2>
						<p className='mb-6 text-red-600 font-medium'>{message}</p>
					</div>
				)}

				<Button
					className='w-full mt-4'
					onClick={() => navigate('/dashboard')}
				>
					Back to Dashboard
				</Button>
			</div>
		</div>
	);
};
