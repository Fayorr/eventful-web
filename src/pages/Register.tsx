import React from 'react';
import { RegisterForm } from '../features/auth/RegisterForm';

export const Register: React.FC = () => {
	return (
		<div className='w-full flex justify-center'>
			<RegisterForm />
		</div>
	);
};
