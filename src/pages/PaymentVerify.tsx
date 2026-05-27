import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';


export const PaymentVerify: React.FC = () => {
	const [searchParams] = useSearchParams();
	const reference = searchParams.get('reference');
	const navigate = useNavigate();

	const [status, setStatus] = useState('Verifying your payment...');
	const [ticketData, setTicketData] = useState(null);

	useEffect(() => {
		const verifyTransaction = async () => {
			try {
				// Call your backend verify endpoint
				const response = await api.get(`/tickets/verify/${reference}`);
				setTicketData(response.data.data);
				setStatus('Payment successful! Here is your ticket.');
            } catch (error: Error | unknown) {
                
                setStatus('Verification failed. Please contact support.');
                console.error('Payment verification error:', error);
			}
		};

		if (reference) verifyTransaction();
	}, [reference]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
			<div className='w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md'>
				<h2 className='mb-4 text-2xl font-bold'>{status}</h2>

				{ticketData && (
					<div className='p-4 mt-6 border rounded-lg bg-gray-50'>
						<h3 className='mb-2 text-lg font-semibold'>Your Ticket QR Code</h3>
						{/* The backend should return the Cloudinary/AWS URL of the QR code in ticketData.qrCodeUrl */}
						<img
							src={ticketData.qrCodeUrl}
							alt='Ticket QR Code'
							className='mx-auto mb-4 w-48 h-48'
						/>
						<p className='text-sm text-gray-500'>
							Reference: {ticketData.paymentReference}
						</p>
					</div>
				)}

				<Button
					className='w-full mt-6'
					onClick={() => navigate('/events')}
				>
					Browse More Events
				</Button>
			</div>
		</div>
	);
};
