import { Link as RouterLink, Route, Switch } from "react-router-dom";
import HomePage from "pages/home";
import LoginPage from "pages/login";
import AuthRequired from "lib/auth/authRequired";
import ArticleIndexPage from "pages/articles/articleIndex";
import ArticleEditorPage from "pages/articles/articleEditor";
import SettingsPage from "pages/settings";
import FilmIndexPage from "pages/films/filmIndex";
import FilmEditorPage from "pages/films/filmEditor";
import EditionEditorPage from "pages/editions/editionEditor";
import PropTypes from "prop-types";
import { URL_PREFIX } from "configs/app";

export default function App() {
	return (
		<>
			<AuthRequired>
				<Switch>
					<Route exact path={URL_PREFIX} component={HomePage} />
					<Route exact path={`${URL_PREFIX}/settings`} component={SettingsPage} />
					<Route exact path={`${URL_PREFIX}/articles`} component={ArticleIndexPage} />
					<Route path={`${URL_PREFIX}/articles/:id`} component={ArticleEditorPage} />
					<Route exact path={`${URL_PREFIX}/films`} component={FilmIndexPage} />
					<Route exact path={`${URL_PREFIX}/films/create`} component={FilmEditorPage} />
					<Route exact path={`${URL_PREFIX}/films/:id`} component={FilmEditorPage} />
					<Route exact path={`${URL_PREFIX}/editions/create`} component={EditionEditorPage} />
					<Route exact path={`${URL_PREFIX}/editions/:id`} component={EditionEditorPage} />
				</Switch>
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
