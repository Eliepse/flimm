/**
 * Convert linebreaks to <br/> tags, displayable with React
 *
 * @param {String} value - A multiline string
 * @returns {Element[]|String} - If single line: a string, multine: an array
 */
export function nl2br(value) {
	const lines = value.split("\n");

	// Single line, return the string
	if (lines.length === 1) {
		return value;
	}

	const lastIndex = lines.length - 1;

	return lines.map((line, i) => (
		<span key={i}>
			{line}
			{/* Add linebreak except on the last line */}
			{i !== lastIndex && <br />}
		</span>
	));
}
