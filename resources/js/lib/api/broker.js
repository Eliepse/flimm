import Cookie from "../cookie";
import { dateToApi, isParsableDate } from "lib/support/dates";
import dayjs from "dayjs";
import ConvertToFormData from "lib/classes/ConvertToFormData";
import axios from "axios";

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
	const hasParams = Boolean(params);

	requestConfig.method = method;
	requestConfig.headers = baseHeaders(config?.headers || {});

	// Parameters as url on GET method
	if (hasParams && typeof params === "object" && method === "GET") {
		Object.entries(params).forEach(([key, value]) => {
			requestUrl.searchParams.set(key, value.toString());
		});
	} else if (hasParams) {
		requestConfig.data = params;
	}

	return axios({ url: requestUrl.href, ...requestConfig });
}

function requestCsrfToken() {
	console.info("[Auth] Requesting token");
	return axios.get("/sanctum/csrf-cookie");
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
		Object.entries(data).map(([k, v]) => [k, isParsableDate(v) ? dateToApi(v) : v])
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

export class EntityBroker {
	/**
	 *
	 * @param {String} basePath
	 * @param {ParseResponseData} parser
	 * @param {PrepareQueryData} preparator
	 */
	constructor(basePath, parser, preparator) {
		this.basePath = basePath;
		this.parser = parser;
		this.preparator = preparator;
		this.converter = new ConvertToFormData(preparator);
	}

	_makeUrl(id) {
		if (!id) {
			return this.basePath;
		}

		return `${this.basePath}/${id}`;
	}

	all() {
		return apiRequest(this.basePath, "GET").then(({ data }) => this.parser.parseAll(data));
	}

	get(id) {
		return apiRequest(this._makeUrl(id), "GET").then(({ data }) => this.parser.parse(data));
	}

	post(id, data = null) {
		return apiRequest(this._makeUrl(id), "POST", this.preparator.prepare(data)).then(({ data }) =>
			this.parser.parse(data)
		);
	}

	postMultipart(id, data = null) {
		return apiRequest(this._makeUrl(id), "POST", this.preparator.prepare(data), {
			headers: { "Content-Type": "multipart/form-data" },
		}).then(({ data }) => this.parser.parse(data));
	}

	delete(id) {
		return apiRequest(this._makeUrl(id), "DELETE");
	}

	create(data) {
		return this.postMultipart(null, data);
	}

	update({ id, ...entity }) {
		if (!id) {
			throw new Error("Cannot update an entity without id.");
		}

		return this.postMultipart(id, entity);
	}

	upsert({ id, ...entity }) {
		return this.postMultipart(id, entity);
	}
}

export default Api;
