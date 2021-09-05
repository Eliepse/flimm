import dayjs from "dayjs";

/**
 * Return basics properties from the formik instance in use on inputs.
 * This prevent repetitive manual writing of inputs.
 *
 * @param {object} formik
 * @param {string} name
 * @returns {{
 *   id: String,
 *   name: String,
 *   onChange: Function,
 *   value: *,
 *   errorText: String,
 *   invalid: Boolean
 * }}
 */
export function formikProps(formik, name) {
	return {
		id: name,
		name,
		onChange: formik.handleChange,
		value: formik.values[name] || "",
		errorText: formik.errors[name],
		invalid: Boolean(formik.errors[name]),
	};
}

export function formikItemProps(formik, name, helpTexts) {
	return {
		name,
		onChange: formik.handleChange,
		help: formik.errors[name],
		extra: helpTexts[name],
		hasFeedback: true,
		validateStatus: formik.errors[name] ? "error" : undefined,
	};
}

/**
 * Convert the fields to dayjs if present into data, and return the modified object.
 *
 * @param {Object} data
 * @param {String[]} fieldsName
 * @returns {Object}
 */
export function parseToDaysjs(data, fieldsName) {
	//noinspection JSCheckFunctionSignatures
	return Object.fromEntries(
		Object.entries(data).map(([key, value]) => {
			if (fieldsName.includes(key)) {
				return [key, value ? dayjs(value) : null];
			}

			return [key, value];
		})
	);
}

/**
 * Convert any Dayjs value to a standart Date object.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function parseDayjsToDate(data) {
	return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, dayjs.isDayjs(v) ? v.toDate() : v]));
}

/**
 *
 * @param {Object} data
 * @param {String[]} fieldsName
 * @returns {Object}
 */
export function parseToSingleFile(data, fieldsName) {
	function extractFile(value) {
		return value.originFileObj || value;
	}

	return Object.fromEntries(
		Object.entries(data)
			// Remove any value that reference already uploaded files
			.filter(([k, v]) => {
				if (v === undefined || v === null) {
					return true;
				}

				if (!fieldsName.includes(k)) {
					return true;
				}

				if (Array.isArray(v) && v.length === 0) {
					return true;
				}

				return typeof v[0]?.uid === "string";
			})
			// Get a first file on list and extract the File instance
			.map(([k, v]) => {
				if (!fieldsName.includes(k)) {
					return [k, v];
				}

				// Field has been reset
				if (Array.isArray(v) && v.length === 0) {
					return [k, null];
				}

				const file = extractFile(Array.isArray(v) ? v[0] : v);
				return [k, file];
			})
	);
}

/**
 *
 * @param {Object} fields
 * @param {String[]} names
 * @returns {Object}
 */
export function normalizedUploadedFiles(fields, names) {
	let index = 0;
	return Object.fromEntries(
		Object.entries(fields).map(([k, v]) => {
			if (!names.includes(k)) {
				return [k, v];
			}

			// If the value is not a string, then it might not be the file url
			if (typeof v === "string") {
				index--;

				const file = { uid: index, name: "thumbnail", status: "done", url: v };
				return [k, [file]];
			}

			return [k, []];
		})
	);
}
