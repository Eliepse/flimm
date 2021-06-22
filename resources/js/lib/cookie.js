/**
 * @returns {Object}
 */
function all() {
	return Object.fromEntries(document.cookie.split(";").map((cookie) => cookie.trim().split("=")));
}

/**
 * @param {String} key
 * @param {any|null} fallback
 * @returns {*, null}
 */
function get(key, fallback = null) {
	const cookies = all();
	return cookies[key] || fallback;
}

const Cookie = {all, get};

export default Cookie;