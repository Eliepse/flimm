/**
 * Stop propagation of the event and execute the callback (next).
 * Acts like a middleware.
 *
 * @param {Function} next
 */
export function noPropagation(next) {
	/** @param {Event} event */
	return (event) => {
		event.stopPropagation();
		return next(event);
	};
}
