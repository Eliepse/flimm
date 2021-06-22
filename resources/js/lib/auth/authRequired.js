import {useAuth} from './useAuth';
import {useRouter} from '../useRouter';
import {useEffect} from 'react';

export default function AuthRequired({children}) {
	const auth = useAuth();
	const router = useRouter();

	// Redirect the client when not authenticated
	useEffect(() => {
		if (!auth.isInitialized) {
			return;
		}

		if (!auth.isAuth) {
			router.push("/admin/login");
		}

	}, [auth.isInitialized, auth.isAuth, router.pathname]);

	return children;
}