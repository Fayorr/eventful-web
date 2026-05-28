// ... imports ...
import { MainLayout } from '../layouts/MainLayout';
import { Events } from '../pages/Events';
import { Register } from '../pages/Register';
import { AuthLayout } from '../features/auth/AuthLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { CreatorDashboard } from '../pages/CreatorDashboard';
import { CreateEventForm } from '../features/events/CreateEventForm';
import { Checkout } from '../pages/Checkout';
import { PaymentVerify } from '../pages/PaymentVerify';
import { ScanTicket } from '../pages/ScanTicket';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		element: <AuthLayout />,
		children: [
			{ path: 'login', element: <Login /> },
			{ path: 'register', element: <Register /> }, // Add register here
		],
	},
	{
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		children: [
			{ path: 'events', element: <Events /> },
			{ path: 'checkout/:eventId', element: <Checkout /> },
			{ path: 'dashboard', element: <CreatorDashboard /> },
			{ path: 'create-event', element: <CreateEventForm /> }, // New route for the form
			{ path: 'payment/verify', element: <PaymentVerify /> }, // New route for payment verification
			{ path: 'scan/:reference', element: <ScanTicket /> }, // New route for ticket scanning
		],
	},
]);
