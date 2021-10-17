import Cookie from "../cookie";
import { dateToApi, isDate } from "lib/support/dates";
import dayjs from "dayjs";

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
		Accept: "application/json",
		"Content-Type": "application/json",
		...headers,
	};
}

/**
 * @param {String} url
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} method
 * @param {Object} params - Data sent as url parameters
 * @param {Object} config - Data sent in the body
 * @returns {Promise<unknown>}
 */
function apiRequest(url, method = "GET", params = null, config = {}) {
	const prefix = url.startsWith("/") ? "/api" : "/api/";
	const requestConfig = {};
	const requestUrl = new URL(prefix + url, document.location.href);
	const headers = baseHeaders(config?.headers || {});
	const hasParams = Boolean(params);
	const hasJsonContentType = headers["Content-Type"] === "application/json";

	requestConfig.method = method;
	requestConfig.headers = headers;

	// Parameters as url on GET method
	if (hasParams && typeof params === "object" && method === "GET") {
		Object.entries(params).forEach(([key, value]) => {
			requestUrl.searchParams.set(key, value.toString());
		});
	} else if (hasParams) {
		requestConfig.body = hasJsonContentType ? JSON.stringify(params) : params;
	}

	// The browser handle the correct content type
	// for us when handling complicated multi-part form data.
	if (hasParams && params instanceof FormData) {
		delete requestConfig.headers["Content-Type"];
	}

	return new Promise((resolve, reject) => {
		fetch(requestUrl.href, requestConfig)
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
		response
			.json()
			.then((data) => reject(data, response))
			.catch(reject);
		return;
	}

	// Handle json compatible responses
	if (isResponseJsonParsable(response)) {
		response
			.json()
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

/**
 * Convert any empty value to an empty string.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function formatEmptyValue(data) {
	return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v || ""]));
}

/**
 * Format any date object of the given object.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function formatDatesValues(data) {
	return Object.fromEntries(
		Object.entries(data).map(([k, v]) => [k, isDate(v) || dayjs.isDayjs(v) ? dateToApi(v) : v])
	);
}

export function formatObjectValues(data) {
	function objectToArrayFields(obj, prefix) {
		const fields = {};

		Object.entries(obj).forEach(([k, v]) => {
			const key = `${prefix}[${k}]`;
			const value = v || "";

			if (value instanceof File) {
				fields[key] = value;
			} else if (dayjs.isDayjs(value)) {
				fields[key] = dateToApi(value.toDate());
			} else if (value instanceof Date) {
				fields[key] = dateToApi(value);
			} else if (typeof value === "object") {
				Object.assign(fields, objectToArrayFields(value, key));
			} else {
				fields[key] = value;
			}
		});

		return fields;
	}

	const fieldsToAppend = {};
	const fieldToFilters = [];

	Object.entries(data).forEach(([k, v]) => {
		if (typeof v !== "object" || v instanceof File) {
			return v || "";
		}

		fieldToFilters.push(k);
		Object.assign(fieldsToAppend, objectToArrayFields(v, k));
	});

	const filteredFields = Object.fromEntries(Object.entries(data).filter(([k]) => !fieldToFilters.includes(k)));

	return Object.assign({}, filteredFields, fieldsToAppend);
}

/**
 * Format singles files value by only keeping the origin File
 * to upload, and remove key/value pair when the field has not
 * been changed, and should not be processed by the backend.
 *
 * @param {Object} data
 * @param {String[]} fields
 * @returns {Object}
 */
export function formatAndFilterSingleFilesValues(data, fields) {
	const filteredData = Object.entries(data).filter(([name, value]) => {
		if (!fields.includes(name)) {
			return true;
		}

		if (!Array.isArray(value)) {
			return false;
		}

		// Remove the fields if not changed (not a new File object).
		return value[0]?.originFileObj;
	});

	//noinspection JSCheckFunctionSignatures
	return Object.fromEntries(
		filteredData.map(([name, value]) => {
			if (!fields.includes(name)) {
				return [name, value];
			}

			// The file need to be cleared
			if (!Array.isArray(value) || value.length === 0) {
				return [name, ""];
			}

			// New file has to be uploaded
			return [name, value[0].originFileObj];
		})
	);
}

const Api = {
	get: (url, data = null, config = {}) => apiRequest(url, "GET", data, config),
	post: (url, data = null, config = {}) => apiRequest(url, "POST", data, config),
	postMultipart: (url, data = null, config = {}) => {
		const mergedConfigs = { ...config, headers: { "Content-Type": "multipart/form-data", ...config.headers } };
		return apiRequest(url, "POST", data, mergedConfigs);
	},
	put: (url, data = null, config = {}) => apiRequest(url, "PUT", data, config),
	patch: (url, data = null, config = {}) => apiRequest(url, "PATCH", data, config),
	delete: (url, data = null, config = {}) => apiRequest(url, "DELETE", data, config),
	requestToken: requestCsrfToken,
	request: apiRequest,
};

export default Api;
