import {useContext} from 'react';
import {authContext} from './authProvider';

/**
 * @returns {{
 *  logout: function(),
 *  isAuth: boolean,
 *  apiToken: null|Object,
 *  isInitialized: boolean,
 *  login: function(),
 *  user: null|Object
 *}}
 */
export function useAuth() {
	//noinspection JSCheckFunctionSignatures
	const auth = useContext(authContext);

	return {
		...auth,
		isInitialized: !auth.initializing,
		isAuth: Boolean(auth?.user),
	};
}