import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-50 flex flex-col'>
			{/* Marketing Navigation */}
			<nav className='px-6 py-4 flex justify-between items-center bg-white shadow-sm'>
				<div className='text-2xl font-extrabold text-primary'>Eventful</div>
				<div className='flex gap-4'>
					<Link
						to='/login'
						className='text-gray-600 hover:text-primary font-medium px-4 py-2'
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
				<section className='px-6 py-20 text-center max-w-5xl mx-auto'>
					<h1 className='text-5xl md:text-7xl font-extrabold text-dark tracking-tight mb-6'>
						Your Passport to{' '}
						<span className='text-primary'>Unforgettable Moments</span>
					</h1>
					<p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto'>
						Discover amazing local events, securely buy tickets, or host your
						own experiences with enterprise-grade analytics and instant QR code
						scanning.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link to='/events'>
							<Button className='w-full sm:w-auto text-lg px-8 py-4'>
								Explore Events
							</Button>
						</Link>
						<Link to='/register'>
							<Button
								variant='secondary'
								className='w-full sm:w-auto text-lg px-8 py-4 bg-white border border-gray-300'
							>
								Become a Creator
							</Button>
						</Link>
					</div>
				</section>

				{/* Features Section */}
				<section className='bg-white py-20'>
					<div className='max-w-7xl mx-auto px-6'>
						<h2 className='text-3xl font-bold text-center text-dark mb-12'>
							Built for both sides of the ticket
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
							{/* Feature 1 */}
							<div className='p-6 bg-gray-50 rounded-2xl border border-gray-100'>
								<div className='w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4'>
									🎫
								</div>
								<h3 className='text-xl font-bold text-dark mb-2'>
									Instant Ticketing
								</h3>
								<p className='text-gray-600'>
									Powered by Paystack. Buy your tickets securely and receive a
									unique QR code instantly in your dashboard.
								</p>
							</div>

							{/* Feature 2 */}
							<div className='p-6 bg-gray-50 rounded-2xl border border-gray-100'>
								<div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4'>
									📱
								</div>
								<h3 className='text-xl font-bold text-dark mb-2'>
									Seamless Scanning
								</h3>
								<p className='text-gray-600'>
									Creators can scan attendee QR codes directly from their
									smartphones at the door. No extra hardware required.
								</p>
							</div>

							{/* Feature 3 */}
							<div className='p-6 bg-gray-50 rounded-2xl border border-gray-100'>
								<div className='w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4'>
									📈
								</div>
								<h3 className='text-xl font-bold text-dark mb-2'>
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
			<footer className='bg-dark text-white py-10 text-center'>
				<p className='text-gray-400'>
					© {new Date().getFullYear()} Eventful API Capstone. Built with MERN,
					Redis, and Vite.
				</p>
			</footer>
		</div>
	);
};
