import { useAuth } from "./useAuth";
import { useRouter } from "../useRouter";
import { useEffect } from "react";
import LoadingLayout from "../../components/layouts/LoadingLayout";
import { useNavigate } from "react-router-dom";

export default function AuthRequired({ children }) {
	const auth = useAuth();
	const router = useRouter();
	const navigate = useNavigate();

	// Redirect the client when not authenticated
	useEffect(() => {
		if (!auth.isInitialized) {
			return;
		}

		if (!auth.isAuth) {
			navigate("/admin/login");
		}

		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.isInitialized, auth.isAuth, router.pathname]);

	if (!auth.isInitialized) {
		return <LoadingLayout />;
	}

	if (!auth.isAuth) {
		return null;
	}

	return children;
}
