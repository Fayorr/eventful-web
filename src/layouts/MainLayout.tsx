import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/auth.service';

export const MainLayout: React.FC = () => {
	const navigate = useNavigate();
	const userString = localStorage.getItem('user');
	const user = userString ? JSON.parse(userString) : null;

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<nav className='bg-white shadow-sm border-b'>
				<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center'>
							<Link
								to='/events'
								className='text-2xl font-extrabold text-primary'
							>
								Eventful
							</Link>
							<div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
								<Link
									to='/events'
									className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-primary'
								>
									Explore Events
								</Link>
								<Link
									to='/my-tickets'
									className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-primary'
								>
									My Tickets
								</Link>
								{user?.role === 'creator' && (
									<Link
										to='/dashboard'
										className='inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-primary'
									>
										Dashboard
									</Link>
								)}
							</div>
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-sm text-gray-700'>Hello, {user?.name}</span>
							<button
								onClick={handleLogout}
								className='px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50'
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* This is where the page content (Events, Dashboard) will render */}
			<main className='py-10'>
				<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
					<Outlet />
				</div>
			</main>
		</div>
	);
};
