import { Form } from "antd";

const useFormDefaults = (formik, initialValue, helpTexts) => {
	const [form] = Form.useForm();

	function itemProps(name, withFeedbacks = false) {
		return {
			name,
			onChange: formik.handleChange,
			help: formik.errors[name],
			extra: helpTexts[name],
			hasFeedback: withFeedbacks && Boolean(formik.errors[name]),
			validateStatus: formik.errors[name] ? "error" : undefined,
		};
	}

	function uploadItemProps(name, withFeedbacks = false, multiple = false) {
		return {
			...itemProps(name, withFeedbacks),
			getValueFromEvent: (e) => {
				// We make sure we have an array of files
				const list = Array.isArray(e) ? e : e && e.fileList;

				if (multiple) {
					return list;
				}

				// Not multiple
				const file = list[1] || list[0];
				return file ? [file] : [];
			},
		};
	}

	return { antForm: form, itemProps, uploadItemProps };
};

export default useFormDefaults;
