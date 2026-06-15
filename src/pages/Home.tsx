import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../api/axios';

// Define the Event interface so TypeScript is happy
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

export const Home: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				// This hits the public endpoint, no token required
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

	// Filter for only future events, and take the first 3 for the teaser grid
	const now = new Date();
	const upcomingEvents = events
		.filter((event) => new Date(event.date) > now)
		.slice(0, 3);

	return (
		<div className='flex flex-col min-h-screen bg-gray-50'>
			{/* Marketing Navigation */}
			<nav className='flex items-center justify-between px-6 py-4 bg-white shadow-sm'>
				<div className='text-2xl font-extrabold text-primary'>Eventful</div>
				<div className='flex gap-4'>
					<Link
						to='/login'
						className='px-4 py-2 font-medium text-gray-600 hover:text-primary'
					>
						Log In
					</Link>
					<Link to='/register'>
						<Button>Sign Up</Button>
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<main className='grow'>
				<section className='max-w-5xl px-6 py-20 mx-auto text-center'>
					<h1 className='mb-6 text-5xl font-extrabold tracking-tight md:text-7xl text-dark'>
						Your Passport to{' '}
						<span className='text-primary'>Unforgettable Moments</span>
					</h1>
					<p className='max-w-2xl mx-auto mb-10 text-xl text-gray-600'>
						Discover amazing local events, securely buy tickets, or host your
						own experiences with enterprise-grade analytics and instant QR code
						scanning.
					</p>
					<div className='flex flex-col justify-center gap-4 sm:flex-row'>
						<Link to='/register'>
							<Button className='w-full px-8 py-4 text-lg sm:w-auto'>
								Get Started
							</Button>
						</Link>
						<Link to='/register'>
							<Button
								variant='secondary'
								className='w-full px-8 py-4 text-lg bg-white border border-gray-300 sm:w-auto'
							>
								Become a Creator
							</Button>
						</Link>
					</div>
				</section>

				{/* TEASER SECTION: Upcoming Events */}
				<section className='px-6 py-16 bg-gray-50'>
					<div className='max-w-7xl mx-auto'>
						<div className='flex items-end justify-between mb-8'>
							<div>
								<h2 className='text-3xl font-bold text-dark'>Trending Now</h2>
								<p className='mt-2 text-gray-600'>
									Grab your tickets before they sell out.
								</p>
							</div>
						</div>

						{isLoading ? (
							<div className='py-20 text-center text-gray-500 animate-pulse'>
								Loading amazing events...
							</div>
						) : upcomingEvents.length > 0 ? (
							<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
								{upcomingEvents.map((event) => (
									<div
										key={event._id}
										className='flex flex-col overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm transition-shadow hover:shadow-md'
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
											</div>
										</div>

										{/* Teaser Button - Routes to Register */}
										<div className='flex gap-2 p-4 border-t bg-gray-50'>
											<Link
												to='/register'
												className='w-full'
											>
												<Button className='w-full'>Sign Up for Tickets</Button>
											</Link>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='p-8 text-center text-gray-500 bg-white rounded-lg shadow'>
								No upcoming events at the moment. Check back soon!
							</div>
						)}

						{/* Call to action to see all events */}
						{!isLoading && upcomingEvents.length > 0 && (
							<div className='mt-10 text-center'>
								<Link
									to='/register'
									className='text-lg font-medium transition-colors text-primary hover:text-green-700'
								>
									Sign up to explore all events &rarr;
								</Link>
							</div>
						)}
					</div>
				</section>

				{/* Features Section */}
				<section className='py-20 bg-white'>
					<div className='px-6 mx-auto max-w-7xl'>
						<h2 className='mb-12 text-3xl font-bold text-center text-dark'>
							Built for both sides of the ticket
						</h2>

						<div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
							{/* Feature 1 */}
							<div className='p-6 border border-gray-100 bg-gray-50 rounded-2xl'>
								<div className='flex items-center justify-center mb-4 text-2xl text-green-600 bg-green-100 w-12 h-12 rounded-xl'>
									🎫
								</div>
								<h3 className='mb-2 text-xl font-bold text-dark'>
									Instant Ticketing
								</h3>
								<p className='text-gray-600'>
									Powered by Paystack. Buy your tickets securely and receive a
									unique QR code instantly in your dashboard.
								</p>
							</div>

							{/* Feature 2 */}
							<div className='p-6 border border-gray-100 bg-gray-50 rounded-2xl'>
								<div className='flex items-center justify-center mb-4 text-2xl text-blue-600 bg-blue-100 w-12 h-12 rounded-xl'>
									📱
								</div>
								<h3 className='mb-2 text-xl font-bold text-dark'>
									Seamless Scanning
								</h3>
								<p className='text-gray-600'>
									Creators can scan attendee QR codes directly from their
									smartphones at the door. No extra hardware required.
								</p>
							</div>

							{/* Feature 3 */}
							<div className='p-6 border border-gray-100 bg-gray-50 rounded-2xl'>
								<div className='flex items-center justify-center mb-4 text-2xl text-purple-600 bg-purple-100 w-12 h-12 rounded-xl'>
									📈
								</div>
								<h3 className='mb-2 text-xl font-bold text-dark'>
									Creator Analytics
								</h3>
								<p className='text-gray-600'>
									Track your revenue, monitor ticket sales, and view live
									attendance data straight from your Creator Dashboard.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className='py-10 text-center text-white bg-dark'>
				<p className='text-gray-400'>
					© {new Date().getFullYear()} Eventful API Capstone. Built with MERN,
					Redis, and Vite.
				</p>
			</footer>
		</div>
	);
};
