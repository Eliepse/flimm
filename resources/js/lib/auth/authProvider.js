import { createContext, useEffect, useMemo, useState } from "react";
import Api, { getCsrfToken } from "../api/broker";
import PropTypes from "prop-types";
import { Spin } from "antd";

//noinspection JSUnusedLocalSymbols
export const authContext = createContext({
	user: null,
	apiToken: null,
	//eslint-disable-next-line no-unused-vars
	login: (email, password) => {},
	logout: () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [initializing, setInitializing] = useState(true);

	// Check if the user is already authenticated
	useEffect(() => {
		function authInitialized() {
			setTimeout(() => {
				console.debug("[Auth] Initialized");
				setInitializing(false);
			}, 250);
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
			.then(({ data }) => {
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
					Api.post("/login", { email, password, remember })
						.then(({ data }) => {
							console.info("[Auth] Authenticated");
							setUser(data);
							resolve();
						})
						.catch((err) => {
							console.error(err);
							reject({ message: err?.message || err.statusText });
						});
				})
				.catch((err) => {
					console.error(err);
					reject({ message: err.statusText });
				})
				.finally(() => setInitializing(false));
		});
	}

	function logout() {
		Api.post("/logout")
			.then(() => setUser(null))
			.catch(console.error);
	}

	const auth = useMemo(
		() => ({
			user,
			initializing,
			login,
			logout,
		}),
		//eslint-disable-next-line react-hooks/exhaustive-deps
		[user, initializing]
	);

	// Display a loader until the Auth provider is ready
	if (initializing) {
		return (
			<div className="h-screen flex justify-center items-center">
				<Spin size="large" />
			</div>
		);
	}

	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

AuthProvider.propTypes = {
	children: PropTypes.any,
};
