import { Link as RouterLink, Route, Switch } from "react-router-dom";
import LoginPage from "pages/login";
import AuthRequired from "lib/auth/authRequired";
import PropTypes from "prop-types";
import { PAGES, URL_PREFIX } from "configs/app";
import { useMemo } from "react";

export default function App() {
	const pages = useMemo(
		() =>
			Object.entries(PAGES).map(([path, component]) => {
				const hasParameter = /:[a-zA-Z]{2,}/.test(path);
				return <Route key={path} exact={!hasParameter} path={URL_PREFIX + path} component={component} />;
			}),
		[]
	);

	return (
		<>
			<AuthRequired>
				<Switch>{pages}</Switch>
			</AuthRequired>
			<Switch>
				<Route exact path={`${URL_PREFIX}/login`} component={LoginPage} />
			</Switch>
		</>
	);
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
