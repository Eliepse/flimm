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
