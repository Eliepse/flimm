export const dummyFn = () => null;

/**
 * @param value
 * @returns {Function}
 */
export function optionFn(value) {
	return typeof value === "function" ? value : () => null;
}
