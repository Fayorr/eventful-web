import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const selectClass = 'min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-base focus:border-primary focus:outline-none';

export const CreateEventForm = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		date: '',
		location: '',
		price: '',
		capacity: '',
		reminder: 'none',
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');
		try {
			await api.post('/events', {
				title: formData.title,
				description: formData.description,
				date: formData.date,
				location: formData.location,
				price: Number(formData.price || 0),
				capacity: Number(formData.capacity),
				reminderHoursBefore: formData.reminder === 'none' ? [] : [Number(formData.reminder)],
			});
			navigate('/events');
		} catch (err: unknown) {
			const failure = err as { response?: { data?: { message?: string } } };
			setError(failure.response?.data?.message || 'We could not publish this event.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='mx-auto max-w-4xl'>
			<Link to='/dashboard' className='inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ink'><ArrowLeft size={17} />Back to dashboard</Link>
			<div className='mt-6 border border-line bg-white'>
				<div className='border-b border-line px-6 py-7 sm:px-9'>
					<div className='flex items-start gap-4'>
						<span className='grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-primary'><CalendarPlus size={22} /></span>
						<div><h1 className='text-3xl font-bold tracking-tight text-ink'>Create an event</h1><p className='mt-2 text-slate-600'>Add the details attendees need before they book.</p></div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='grid gap-8 px-6 py-8 sm:px-9'>
					{error && <div role='alert' className='border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800'>{error}</div>}
					<section className='grid gap-5'>
						<div><h2 className='text-lg font-bold text-ink'>Event details</h2><p className='mt-1 text-sm text-slate-500'>Keep the title clear and the description useful.</p></div>
						<Input label='Event title' name='title' value={formData.title} onChange={handleChange} required />
						<div className='grid gap-2'>
							<label htmlFor='event-description' className='text-sm font-semibold text-slate-700'>Description</label>
							<textarea id='event-description' name='description' rows={5} value={formData.description} onChange={handleChange} className='rounded-xl border border-slate-300 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none' required />
						</div>
					</section>

					<section className='grid gap-5 border-t border-line pt-8'>
						<h2 className='text-lg font-bold text-ink'>When and where</h2>
						<div className='grid gap-5 sm:grid-cols-2'>
							<Input label='Date and time' type='datetime-local' name='date' value={formData.date} onChange={handleChange} required />
							<Input label='Location' name='location' value={formData.location} onChange={handleChange} placeholder='Venue or online' required />
						</div>
					</section>

					<section className='grid gap-5 border-t border-line pt-8'>
						<h2 className='text-lg font-bold text-ink'>Tickets</h2>
						<div className='grid gap-5 sm:grid-cols-2'>
							<Input label='Price in naira' type='number' name='price' value={formData.price} onChange={handleChange} min='0' placeholder='0 for a free event' required />
							<Input label='Capacity' type='number' name='capacity' value={formData.capacity} onChange={handleChange} min='1' placeholder='Number of attendees' required />
						</div>
						<div className='grid gap-2'>
							<label htmlFor='event-reminder' className='text-sm font-semibold text-slate-700'>Creator reminder</label>
							<select id='event-reminder' name='reminder' value={formData.reminder} onChange={handleChange} className={selectClass}>
								<option value='none'>No reminder</option>
								<option value='24'>1 day before</option>
								<option value='168'>1 week before</option>
							</select>
						</div>
					</section>

					<div className='flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:justify-end'>
						<Link to='/dashboard' className='inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100'>Cancel</Link>
						<Button type='submit' isLoading={isLoading} loadingText='Publishing…'>Publish event</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
