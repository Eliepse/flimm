import {useContext} from 'react';
import {useAuthContext} from 'lib/auth/authProvider.jsx';

/**
 * @returns {{
 *  logout: function(),
 *  isAuth: boolean,
 *  apiToken: null|Object,
 *  isInitialized: boolean,
 *  login: function(String, String),
 *  user: null|Object
 *}}
 */
export function useAuth() {
	//noinspection JSCheckFunctionSignatures
	const auth = useAuthContext();

	return {
		...auth,
		isInitialized: !auth.initializing,
		isAuth: Boolean(auth?.user),
	};
}
