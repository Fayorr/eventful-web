import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CreateEventForm: React.FC = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		date: '',
		location: '',
		price: 0,
		capacity: 0,
		creatorReminder: 'none',
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === 'price' || name === 'capacity' ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			// Send the data to your backend
			await api.post('/events', formData);
			// Redirect to the events page to see the newly created event
			navigate('/events');
		} catch (err: unknown) {
			const error = err as { response?: { data?: { message?: string } } };
			setError(error.response?.data?.message || 'Failed to create event');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md'
		>
			<h2 className='mb-6 text-2xl font-bold text-dark'>Create New Event</h2>
			{error && (
				<div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md'>
					{error}
				</div>
			)}
			<Input
				label='Event Title'
				name='title'
				value={formData.title}
				onChange={handleChange}
				required
			/>
			<div className='flex flex-col mb-4'>
				<label className='mb-1 text-sm font-medium text-gray-700'>
					Description
				</label>
				<textarea
					name='description'
					rows={3}
					value={formData.description}
					onChange={handleChange}
					className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
					required
				/>
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<Input
					label='Date and Time'
					type='datetime-local'
					name='date'
					value={formData.date}
					onChange={handleChange}
					required
				/>
				<Input
					label='Location'
					name='location'
					value={formData.location}
					onChange={handleChange}
					required
				/>
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<Input
					label='Ticket Price (₦) - 0 for Free'
					type='number'
					name='price'
					value={formData.price === 0 ? '' : formData.price}
					onChange={(e) => {
						const val = e.target.value === '' ? 0 : Number(e.target.value);
						setFormData((prev) => ({ ...prev, price: val }));
					}}
					onBlur={(e) => {
						if (e.target.value === '') {
							setFormData((prev) => ({ ...prev, price: 0 }));
						}
					}}
					min='0'
					placeholder='0'
					required
				/>
				<Input
					label='Total Capacity'
					type='number'
					name='capacity'
					value={formData.capacity === 0 ? '' : formData.capacity}
					onChange={(e) => {
						const val = e.target.value === '' ? 0 : Number(e.target.value);
						setFormData((prev) => ({ ...prev, capacity: val }));
					}}
					onBlur={(e) => {
						if (e.target.value === '') {
							setFormData((prev) => ({ ...prev, capacity: 0 }));
						}
					}}
					min='1'
					placeholder='1'
					required
				/>
			</div>{' '}
			<div className='flex flex-col mb-4'>
				<label className='mb-1 text-sm font-medium text-gray-700'>
					Default Reminder for Attendees
				</label>
				<select
					name='creatorReminder'
					value={formData.creatorReminder}
					onChange={handleChange}
					className='px-4 py-2 border border-gray-300 rounded-md'
				>
					<option value='none'>No default reminder</option>
					<option value='1_day'>1 Day Before</option>
					<option value='1_week'>1 Week Before</option>
				</select>
			</div>
			<Button
				type='submit'
				variant='primary'
				isLoading={isLoading}
				className='w-full mt-4'
			>
				Publish Event
			</Button>
		</form>
	);
};
