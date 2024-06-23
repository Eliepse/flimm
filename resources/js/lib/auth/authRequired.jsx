import { useAuth } from "./useAuth";
import { useRouter } from "../useRouter";
import { useEffect, useMemo, useState } from "react";
import LoadingLayout from "@/components/layouts/LoadingLayout.jsx";
import { useNavigate } from "react-router-dom";
import { createStore } from "@reduxjs/toolkit";
import rootReducer from "reducers/reducers";
import { Provider } from "react-redux";
import CachePreloadWorker from "lib/classes/loaders/CachePreloadWorker";
import FilmsCachePreloader from "lib/classes/loaders/FilmsCachePreloader";
import PropTypes from "prop-types";

const store = createStore(rootReducer);

export default function AuthRequired({ children }) {
	const auth = useAuth();
	const router = useRouter();
	const navigate = useNavigate();
	const [loadingMsg, setLoadingMsg] = useState("Chargement...");
	const preloader = useMemo(() => {
		const preloader = new CachePreloadWorker(new FilmsCachePreloader());
		preloader.onPreloaderUpdate = () => {
			setLoadingMsg(preloader.loadingMessage);
		};
		return preloader;
	}, []);
	const isAuth = auth.isInitialized && auth.isAuth;

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

	useEffect(() => {
		if (!isAuth) {
			return;
		}

		preloader
			.load(store.dispatch)
			.then(() => setLoadingMsg(null))
			.catch(() => setLoadingMsg("Error"));
	}, [isAuth, preloader]);

	if (!auth.isInitialized) {
		return <LoadingLayout text={loadingMsg} />;
	}

	if (isAuth && !preloader.isReady()) {
		return <LoadingLayout text={loadingMsg} />;
	}

	if (!auth.isAuth) {
		return null;
	}

	return <Provider store={store}>{children}</Provider>;
}

AuthRequired.propTypes = {
	children: PropTypes.any,
};
