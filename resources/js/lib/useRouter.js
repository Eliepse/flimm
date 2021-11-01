import { useMemo } from "react";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import queryString from "query-string";
import { URL_PREFIX } from "configs/app";

export function useRouter() {
	const params = useParams();
	const location = useLocation();
	const history = useHistory();
	const match = useRouteMatch();

	// Return our custom router object
	// Memoize so that a new object is only returned if something changes
	return useMemo(() => {
		return {
			// For convenience add push(), replace(), pathname at top level
			push: history.push,
			replace: history.replace,
			pathname: location.pathname,
			pathnameAdmin: location.pathname.replace(URL_PREFIX, "") || "/",
			// Merge params and parsed query string into single "query" object
			// so that they can be used interchangeably.
			// Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
			query: {
				...queryString.parse(location.search), // Convert string to object
				...params,
			},
			// Include match, location, history objects so we have
			// access to extra React Router functionality if needed.
			match,
			location,
			history,
			goHome: () => history.push(URL_PREFIX),
			pushAdmin: (url) => history.push(URL_PREFIX + url),
		};
	}, [params, match, location, history]);
}
