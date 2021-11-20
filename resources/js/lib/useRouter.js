import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import queryString from "query-string";
import { URL_PREFIX } from "configs/app";

export function useRouter() {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	// Return our custom router object
	// Memoize so that a new object is only returned if something changes
	return useMemo(() => {
		return {
			pathname: location.pathname,
			pathnameAdmin: location.pathname.replace(URL_PREFIX, "") || "/",
			// Merge params and parsed query string into single "query" object
			// so that they can be used interchangeably.
			// Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
			// TODO(elie): replace query with useParams() ?
			query: {
				...queryString.parse(location.search), // Convert string to object
				...params,
			},
			goHome: () => navigate(URL_PREFIX),
			pushAdmin: (url) => navigate(URL_PREFIX + url),
		};
	}, [location, params, navigate]);
}
