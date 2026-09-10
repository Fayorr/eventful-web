import {
	CalendarDays,
	LayoutDashboard,
	LogOut,
	Plus,
	Ticket,
	TicketCheck,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { logout } from '../features/auth/auth.service';

type StoredUser = { name?: string; role?: 'creator' | 'eventee' };

const readUser = (): StoredUser | null => {
	try {
		const value = localStorage.getItem('user');
		return value ? (JSON.parse(value) as StoredUser) : null;
	} catch {
		return null;
	}
};

const navClass = ({ isActive }: { isActive: boolean }) =>
	`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold ${
		isActive
			? 'bg-emerald-50 text-primary'
			: 'text-slate-600 hover:bg-slate-100 hover:text-ink'
	}`;

export const MainLayout = () => {
	const user = readUser();
	const isCreator = user?.role === 'creator';

	return (
		<div className='min-h-screen bg-canvas'>
			<header className='sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-sm'>
				<div className='mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8'>
					<Link to='/' className='flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-ink'>
						<span className='grid size-8 place-items-center rounded-lg bg-primary text-white'>
							<TicketCheck size={18} />
						</span>
						Eventful
					</Link>

					<nav aria-label='Primary navigation' className='hidden items-center gap-1 md:flex'>
						<NavLink to='/events' className={navClass}><CalendarDays size={17} />Events</NavLink>
						{isCreator ? (
							<>
								<NavLink to='/dashboard' className={navClass}><LayoutDashboard size={17} />Dashboard</NavLink>
								<NavLink to='/create-event' className={navClass}><Plus size={17} />Create event</NavLink>
							</>
						) : (
							<NavLink to='/my-tickets' className={navClass}><Ticket size={17} />My tickets</NavLink>
						)}
					</nav>

					<div className='flex items-center gap-2'>
						<span className='hidden max-w-40 truncate text-sm text-slate-500 sm:block'>
							{user?.name ?? 'Account'}
						</span>
						<button
							type='button'
							onClick={logout}
							className='grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700'
							aria-label='Log out'
						>
							<LogOut size={18} />
						</button>
					</div>
				</div>

				<nav aria-label='Mobile navigation' className='flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden'>
					<NavLink to='/events' className={navClass}><CalendarDays size={16} />Events</NavLink>
					{isCreator ? (
						<>
							<NavLink to='/dashboard' className={navClass}><LayoutDashboard size={16} />Dashboard</NavLink>
							<NavLink to='/create-event' className={navClass}><Plus size={16} />Create</NavLink>
						</>
					) : (
						<NavLink to='/my-tickets' className={navClass}><Ticket size={16} />Tickets</NavLink>
					)}
				</nav>
			</header>

			<main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10'>
				<Outlet />
			</main>
		</div>
	);
};
