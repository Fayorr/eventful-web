import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import axios from 'axios';

interface Ticket {
	_id: string;
	qrCodeUrl: string;
	paymentReference: string;
}

export const TicketReminderWidget: React.FC<{ ticketId: string }> = ({
	ticketId,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [delayHours, setDelayHours] = useState('24'); // Default: 1 day

	const handleSetReminder = async () => {
		setIsLoading(true);
		setMessage('');

		try {
			// Hit your new custom reminder endpoint
			const response = await api.post(`/tickets/${ticketId}/reminder`, {
				delayInHours: Number(delayHours),
			});

			const scheduledDate = new Date(
				response.data.data.scheduledFor,
			).toLocaleString();
			setMessage(`✅ Reminder scheduled for ${scheduledDate}`);
		} catch (error: unknown) {
			let errorMessage = 'Failed to set reminder';
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			setMessage(`❌ ${errorMessage}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='p-4 mt-6 border border-gray-200 rounded-lg bg-gray-50'>
			<h3 className='mb-2 text-sm font-bold text-gray-800'>
				Never miss it! Set a reminder:
			</h3>

			<div className='flex gap-2'>
				<select
					value={delayHours}
					onChange={(e) => setDelayHours(e.target.value)}
					className='grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
				>
					<option value='1'>1 Hour Before</option>
					<option value='24'>1 Day Before</option>
					<option value='48'>2 Days Before</option>
					<option value='168'>1 Week Before</option>
				</select>

				<Button
					onClick={handleSetReminder}
					isLoading={isLoading}
					className='whitespace-nowrap'
				>
					Set
				</Button>
			</div>

			{message && (
				<p
					className={`mt-3 text-xs font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}
				>
					{message}
				</p>
			)}
		</div>
	);
};

export const PaymentVerify: React.FC = () => {
	const [searchParams] = useSearchParams();
	const reference = searchParams.get('reference');
	const navigate = useNavigate();

	const [status, setStatus] = useState('Verifying your payment...');
	const [ticketData, setTicketData] = useState<Ticket | null>(null);

	useEffect(() => {
		const verifyTransaction = async () => {
			try {
				// Call your backend verify endpoint
				const response = await api.get(`/tickets/verify/${reference}`);
				setTicketData(response.data.data);
				setStatus('Payment successful! Here is your ticket.');
			} catch (error: unknown) {
				const errMessage =
					error instanceof Error ? error.message : 'Unknown error';
				setStatus('Verification failed. Please contact support.');
				console.error('Payment verification error:', errMessage);
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
				{/* <div className='p-4 mt-4 bg-white border rounded-lg shadow-sm'>
				<h3 className='mb-2 text-md font-bold'>Set a Personal Reminder</h3>
				<select
					onChange={(e) => handleSetReminder(e.target.value)}
					className='w-full px-4 py-2 border border-gray-300 rounded-md'
				>
					<option value='1_hour'>1 Hour Before</option>
					<option value='1_day'>1 Day Before</option>
					<option value='2_days'>2 Days Before</option>
				</select>
			</div> */}
				{ticketData && <TicketReminderWidget ticketId={ticketData._id} />}{' '}
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
