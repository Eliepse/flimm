import dayjs from "dayjs";
import moment from "moment";

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
 *
 * @param value
 * @return {boolean}
 */
export function isParsableDate(value) {
	return isDate(value) || moment.isMoment(value) || dayjs.isDayjs(value);
}

/**
 * Format a date as expected by the API.
 *
 * @param {Date} date
 * @returns {String|null}
 */
export function dateToApi(date) {
	if (dayjs.isDayjs(date)) {
		return date.format(API_DATETIME_FORMAT);
	}

	// Legacy antd (v4) uses moment
	if (moment.isMoment(date)) {
		return date.format(API_DATETIME_FORMAT);
	}

	if (isDate(date)) {
		return dayjs(date).format(API_DATETIME_FORMAT);
	}

	return null;
}
