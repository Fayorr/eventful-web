import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-extrabold text-primary'>Eventful</h1>
				<p className='mt-2 text-gray-600'>
					Your passport to unforgettable moments.
				</p>
			</div>
			{/* Outlet renders the child routes (e.g., Login or Register pages) */}
			<Outlet />
		</div>
	);
};
