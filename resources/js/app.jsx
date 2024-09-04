import { Link as RouterLink, Route, Routes } from "react-router-dom";
import LoginPage from "pages/login.jsx";
import AuthRequired from "@/lib/auth/authRequired.jsx";
import PropTypes from "prop-types";
import { PAGES, URL_PREFIX } from "configs/app";
import { Suspense, useMemo } from "react";
import LoadingLayout from "@/components/layouts/LoadingLayout.jsx";

export default function App() {
	const pages = useMemo(
		() =>
			Object.entries(PAGES).map(([path, pageAsync]) => {
				const hasParameter = /:[a-zA-Z]{2,}/.test(path);
				return <Route key={path} exact={!hasParameter} path={URL_PREFIX + path} element={<Loader PageAsync={pageAsync} />} />;
			}),
		[]
	);

	return (
		<>
			<AuthRequired>
				<Routes>{pages}</Routes>
			</AuthRequired>
			<Routes>
				<Route exact path={`${URL_PREFIX}/login`} element={<LoginPage />} />
			</Routes>
		</>
	);
}

function Loader({ PageAsync }) {
	return <Suspense fallback={<LoadingLayout />}>
		<PageAsync />
	</Suspense>
}

export function Link({ to, ...props }) {
	//eslint-disable-next-line
	const link = to || props.href;
	return <RouterLink {...props} to={`${URL_PREFIX}${link}`} />;
}

Link.propTypes = {
	/**
	 * The href value without the global URL_PREFIX.
	 */
	to: PropTypes.string,
};
