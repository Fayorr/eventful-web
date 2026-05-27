import React from 'react';
import { RegisterForm } from '../features/auth/RegisterForm';

export const Register: React.FC = () => {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<RegisterForm />
		</div>
	);
};
