import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';

export const Login: React.FC = () => {
	return (
		<div className='w-full flex justify-center'>
			<LoginForm />
		</div>
	);
};
