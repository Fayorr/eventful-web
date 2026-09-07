import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export const Input: React.FC<InputProps> = ({
	label,
	error,
	className = '',
	...props
}) => {
	const generatedId = useId();
	const inputId = props.id ?? generatedId;

	return (
		<div className='flex flex-col gap-2'>
			<label htmlFor={inputId} className='text-sm font-semibold text-slate-700'>{label}</label>
			<input
				id={inputId}
				className={`min-h-12 rounded-xl border bg-white px-4 text-base text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none ${
					error ? 'border-red-500' : 'border-slate-300'
				} ${className}`}
				{...props}
			/>
			{error && <span className='text-sm text-red-700'>{error}</span>}
		</div>
	);
};
