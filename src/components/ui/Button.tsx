import React from 'react';

// Button component for the eventful app
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger';
	isLoading?: boolean;
	loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	isLoading = false,
	loadingText = 'Please wait…',
	children,
	className = '',
	disabled,
	...props
}) => {
	const baseClass =
		'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed';
	const variantClass = {
		primary: 'bg-primary text-white hover:bg-primary-dark',
		secondary:
			'border border-line bg-white text-ink hover:border-slate-400 hover:bg-slate-50',
		danger: 'bg-red-700 text-white hover:bg-red-800',
	}[variant];

	return (
		<button
			className={`${baseClass} ${variantClass} ${
				isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading ? loadingText : children}
		</button>
	);
};
