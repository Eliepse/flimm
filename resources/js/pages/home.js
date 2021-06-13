import DashboardLayout from '../components/layouts/DashboardLayout';
import {Link} from '../app';

export default function HomePage() {
	return (
		<DashboardLayout>

			Homepage | <Link to="/login"><a href="#">Login</a></Link>
		</DashboardLayout>
	);
}