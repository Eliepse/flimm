/**
 * Return the filename of a path.
 *
 * @param {String} path
 */
export function getFilename(path) {
	const startIndex = path.lastIndexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
	return path.substring(startIndex + 1);
}