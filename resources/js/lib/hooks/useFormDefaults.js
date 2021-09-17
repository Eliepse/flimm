import { Form } from "antd";
import { useCallback } from "react";

const useFormDefaults = (formik, initialValue, helpTexts) => {
	const [form] = Form.useForm();

	const itemProps = useCallback(
		(name, withFeedbacks = false) => ({
			name,
			onChange: formik.handleChange,
			help: formik.errors[name],
			extra: helpTexts[name],
			hasFeedback: withFeedbacks && Boolean(formik.errors[name]),
			validateStatus: formik.errors[name] ? "error" : undefined,
		}),
		[formik.errors, formik.handleChange, helpTexts]
	);

	const uploadItemProps = useCallback(
		(name, withFeedbacks = false, multiple = false) => ({
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
		}),
		[itemProps]
	);

	const editorJSProps = useCallback(
		(name) => ({
			name,
			onChange: (value) => {
				formik.handleChange({ target: { name, value } });
			},
		}),
		[formik]
	);

	return { antForm: form, itemProps, uploadItemProps, editorJSProps };
};

export default useFormDefaults;
