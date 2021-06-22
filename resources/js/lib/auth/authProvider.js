import {createContext, useEffect, useMemo, useState} from 'react';
import Api, {getCsrfToken} from '../api/broker';
import {LoadingSpinner} from 'hds-react';

export const authContext = createContext({
	user: null,
	apiToken: null,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({children}) {
	const [user, setUser] = useState(null);
	const [initializing, setInitializing] = useState(true);

	// Check if the user is already authenticated
	useEffect(() => {
		function authInitialized() {
			setTimeout(() => setInitializing(false), 250);
		}

		// Break if there is no token
		if (!getCsrfToken()) {
			console.info("[Auth] Token missing");
			authInitialized();
			return;
		}

		// If there is a token, we check if the user is connected
		console.info("[Auth] Checking auth");
		Api.get("/me")
			.then((data) => {
				console.info("[Auth] Already authenticated");
				authInitialized();
				setUser(data);
			})
			.catch(() => {
				console.info("[Auth] Not authenticated");
				authInitialized();
			});
	}, []);


	async function login(email, password, remember) {
		if (user) {
			return;
		}

		return new Promise((resolve, reject) => {
			Api.requestToken()
				.then(() => {

					Api.post("/login", {email, password, remember})
						.then((data) => {
							console.info("[Auth] Authenticated");
							setUser(data);
							resolve();
						})
						.catch((err) => {
							console.error(err);
							reject({ message: err?.message || err.statusText })
						});

				})
				.catch((err) => {
					console.error(err);
					reject({ message: err.statusText })
				});
		});
	}

	function logout() {
		Api.post("/logout")
			.then(() => setUser(null))
			.catch(console.error);
	}

	const auth = useMemo(() => ({
		user,
		initializing,
		login,
		logout,
	}), [user, initializing]);

	// Display a loader until the Auth provider is ready
	if (initializing) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="large"/>
			</div>
		);
	}

	return <authContext.Provider value={auth} children={children}/>;
}