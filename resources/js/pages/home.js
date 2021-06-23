import DashboardLayout from '../components/layouts/DashboardLayout';
import {Link} from '../app';

export default function HomePage() {
	return (
		<DashboardLayout>

			Homepage | <Link to="/login">Login</Link>
		</DashboardLayout>
	);
}