/**
 *
 * @param {*} value
 * @returns {Array}
 */
export function wrap(value) {
	return Array.isArray(value) ? value : [value];
}