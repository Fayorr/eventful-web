interface SkeletonProps {
	className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
	<div aria-hidden='true' className={`bg-slate-100 ${className}`} />
);
