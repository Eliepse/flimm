import {Link as RouterLink, Route, Switch} from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';

export const URL_PREFFIX = "/admin";

export default function App() {
	return (
		<Switch>
			<Route exact path={URL_PREFFIX} component={HomePage}/>
			<Route exact path={`${URL_PREFFIX}/login`} component={LoginPage}/>
		</Switch>
	);
}

export function Link({to, ...props}) {
	return <RouterLink {...props} to={`${URL_PREFFIX}${to}`}/>;
}