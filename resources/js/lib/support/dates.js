import dayjs from "dayjs";

export const API_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ";

/**
 * Check if the given value is an instance of Date or not.
 *
 * @param value
 * @return {boolean}
 */
export function isDate(value) {
	return value instanceof Date;
}

/**
 * Format a date as expected by the API.
 *
 * @param {Date} date
 * @returns {String|null}
 */
export function dateToApi(date) {
	if (!isDate(date)) {
		return null;
	}

	return dayjs(date).format(API_DATETIME_FORMAT);
}
