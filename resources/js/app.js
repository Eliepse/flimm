import {Link as RouterLink, Route, Switch} from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import AuthRequired from './lib/auth/authRequired';

export const URL_PREFFIX = "/admin";

export default function App() {
	return (
		<>
			<AuthRequired>
				<Switch>
					<Route exact path={URL_PREFFIX} component={HomePage}/>
				</Switch>
			</AuthRequired>
			<Switch>
				<Route exact path={`${URL_PREFFIX}/login`} component={LoginPage}/>
			</Switch>
		</>
	);
}

export function Link({to, ...props}) {
	const link = to || props.href;
	return <RouterLink {...props} to={`${URL_PREFFIX}${link}`}/>;
}