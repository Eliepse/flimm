import BaseLayout from '../components/layouts/baseLayout';
import {Link} from '../app';

export default function LoginPage() {
	return (
		<BaseLayout>
			Login | <Link to="/">Homepage</Link>
		</BaseLayout>
	);
}