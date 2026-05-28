import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

interface Event {
	_id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	price: number;
	capacity: number;
	ticketsSold: number;
}

interface ShareLinks {
	whatsapp: string;
	twitter: string;
	facebook: string;
	linkedin: string;
	copyUrl: string;
}

export const Events: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// State to handle the sharing modal
	const [shareLinks, setShareLinks] = useState<ShareLinks | null>(null);
	const [activeShareEvent, setActiveShareEvent] = useState<string | null>(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await api.get('/events');
				setEvents(response.data.data);
			} catch (error) {
				console.error('Failed to load events', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const handleShareClick = async (eventId: string) => {
		try {
			// Hit your backend to generate the specific links for this event
			const response = await api.get(`/events/${eventId}/share`);
			setShareLinks(response.data.data);
			setActiveShareEvent(eventId);
		} catch (error) {
			console.error('Failed to fetch share links', error);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				Loading amazing events...
			</div>
		);
	}

	return (
		<div className='relative'>
			<h1 className='mb-8 text-3xl font-bold text-dark'>Upcoming Events</h1>
			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{events.map((event) => (
					<div
						key={event._id}
						className='flex flex-col overflow-hidden bg-white rounded-lg shadow-md'
					>
						<div className='p-6 grow'>
							<h3 className='mb-2 text-xl font-bold'>{event.title}</h3>
							<p className='mb-4 text-sm text-gray-600 line-clamp-2'>
								{event.description}
							</p>

							<div className='mb-2 text-sm text-gray-500'>
								📅 {new Date(event.date).toLocaleDateString()}
							</div>
							<div className='mb-4 text-sm text-gray-500'>
								📍 {event.location}
							</div>

							<div className='flex items-center justify-between mt-auto'>
								<span className='text-lg font-bold text-primary'>
									{event.price === 0
										? 'FREE'
										: `₦${event.price.toLocaleString()}`}
								</span>
								<span className='text-xs text-gray-500'>
									{event.capacity - event.ticketsSold} spots left
								</span>
							</div>
						</div>

						{/* Updated Button Row */}
						<div className='flex gap-2 p-4 border-t bg-gray-50'>
							<Button
								className='w-full'
								onClick={() =>
									(window.location.href = `/checkout/${event._id}`)
								}
							>
								Get Tickets
							</Button>
							<button
								onClick={() => handleShareClick(event._id)}
								className='px-4 py-2 text-sm font-medium transition-colors border rounded-md text-primary border-primary hover:bg-green-50'
							>
								Share
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Empty State */}
			{events.length === 0 && (
				<div className='p-8 text-center text-gray-500 bg-white rounded-lg shadow'>
					No events found. Check back later!
				</div>
			)}

			{/* Share Modal Overlay */}
			{activeShareEvent && shareLinks && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
					<div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-xl'>
						<h3 className='mb-4 text-lg font-bold text-center'>
							Share this Event
						</h3>
						<div className='flex flex-col gap-3'>
							<a
								href={shareLinks.whatsapp}
								target='_blank'
								rel='noopener noreferrer'
								className='px-4 py-2 text-center text-white bg-green-500 rounded-md hover:bg-green-600'
							>
								Share on WhatsApp
							</a>
							<a
								href={shareLinks.twitter}
								target='_blank'
								rel='noopener noreferrer'
								className='px-4 py-2 text-center text-white bg-blue-400 rounded-md hover:bg-blue-500'
							>
								Share on Twitter
							</a>
							<a
								href={shareLinks.facebook}
								target='_blank'
								rel='noopener noreferrer'
								className='px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700'
							>
								Share on Facebook
							</a>
							<a
								href={shareLinks.copyUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='px-4 py-2 text-center text-white bg-gray-500 rounded-md  hover:bg-black'
							>
								Copy Event Link
							</a>
						</div>
						<button
							onClick={() => setActiveShareEvent(null)}
							className='w-full mt-4 text-sm  text-gray-500 hover:text-800 cursor-pointer'
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
