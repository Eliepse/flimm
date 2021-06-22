import Cookie from '../cookie';

export function getCsrfToken() {
	return decodeURIComponent(Cookie.get("XSRF-TOKEN"));
}

/**
 * @param {Object} headers
 * @returns {{Accept: string, 'X-XSRF-TOKEN': string}}
 */
function baseHeaders(headers = {}) {
	return {
		"X-XSRF-TOKEN": getCsrfToken(),
		"Accept": "application/json",
		"Content-Type": "application/json",
		...headers,
	};
}

/**
 * @param {String} url
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} method
 * @param {Object} params - Data sent as url parameters
 * @param {Object} body - Data sent in the body
 * @returns {Promise<unknown>}
 */
function apiRequest(url, method, params = null, body = null) {

	const prefix = url.startsWith("/") ? "/api" : "/api/";
	const freshUrl = new URL(prefix + url, document.location.href);

	// Add query parameters if set
	if (params && typeof params === "object") {
		Object.entries(params).forEach(([key, value]) => {
			freshUrl.searchParams.set(key, value.toString());
		});
	}

	return new Promise((resolve, reject) => {
		fetch(freshUrl.href, {
			method,
			headers: baseHeaders(),
			body: (body && method !== "GET") ? JSON.stringify(body) : body,
		})
			.then((res) => handleRequestResponse(res, resolve, reject))
			.catch((err) => handeRequestError(err, resolve, reject));
	});
}

/**
 * @param {Response} response
 */
function isResponseJsonParsable(response) {
	if (response.status === 204) {
		return false;
	}

	return response.headers.get("Content-Type") === "application/json";
}

/**
 * @param {Response} response
 * @param {Function} resolve
 * @param {Function} reject
 */
function handleRequestResponse(response, resolve, reject) {
	if (!response.ok) {
		response.json()
			.then((data) => reject(data, response))
			.catch(reject);
		return;
	}

	// Handle json compatible responses
	if (isResponseJsonParsable(response)) {
		response.json()
			.then((data) => resolve(data, response))
			.catch(reject);
		return;
	}

	resolve(null, response);
}

/**
 * @param {Object} error
 * @param {Function} resolve
 * @param {Function} reject
 */
function handeRequestError(error, resolve, reject) {
	console.error(error);
	reject(error);
}

function requestCsrfToken() {
	console.info("[Auth] Requesting token");

	return new Promise((resolve, reject) => {
		fetch("/sanctum/csrf-cookie")
			.then((res) => handleRequestResponse(res, resolve, reject))
			.catch((err) => handeRequestError(err, resolve, reject));
	});
}

const Api = {
		get: (url, params = null) => apiRequest(url, "GET", params),
		post: (url, data = null) => apiRequest(url, "POST", null, data),
		put: (url, data = null) => apiRequest(url, "PUT", null, data),
		patch: (url, data = null) => apiRequest(url, "PATCH", null, data),
		delete: (url, data = null) => apiRequest(url, "DELETE", null, data),
		requestToken: requestCsrfToken,
		request: apiRequest,
	}
;

export default Api;