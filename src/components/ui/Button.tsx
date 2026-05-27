import React from 'react';

// Button component for the eventful app
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	isLoading = false,
	children,
	className = '',
	disabled,
	...props
}) => {
	const baseClass =
		'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
	const variantClass =
		variant === 'primary'
			? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
			: 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-300';

	return (
		<button
			className={`${baseClass} ${variantClass} ${
				isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading ? 'Loading...' : children}
		</button>
	);
};
