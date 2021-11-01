/**
 *
 * @param {*} value
 * @returns {Array}
 */
export function wrap(value) {
	return Array.isArray(value) ? value : [value];
}

/**
 * Makes sure an array is return, but do not wrap falsy values.
 *
 * @param {*} value
 * @returns {Array}
 */
export function optionalArr(value) {
	return !value ? [] : wrap(value);
}
