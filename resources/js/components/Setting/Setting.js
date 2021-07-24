import FileInput from "../FileInput/FileInput";
import { Button, TextInput } from "hds-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiSettings from "../../lib/api/apiSettings";

const Setting = ({ label, name, isMedia = false, initialValue }) => {
	const [loading, setLoading] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const [setting, setSetting] = useState({});

	useEffect(() => setSetting(initialValue || {}), [initialValue]);

	function handleChange({ target }) {
		setIsDirty(true);
		setSetting((st) => ({
			...st,
			value: isMedia ? target.files[0] : target.value,
		}));
	}

	function submit() {
		setLoading(true);
		apiSettings
			.upsert({ name, value: setting.value })
			.then((data) => {
				setSetting(data);
				setIsDirty(false);
				setLoading(false);
			})
			.catch(console.error);
	}

	return (
		<div className="flex items-end mb-4">
			{isMedia ? (
				<FileInput
					label={label}
					className="flex-auto"
					value={setting.value}
					onChange={handleChange}
				/>
			) : (
				<TextInput
					label={label}
					value={setting.value || ""}
					className="flex-auto"
					onChange={handleChange}
				/>
			)}
			{isDirty && (
				<Button className="ml-4" onClick={submit} isLoading={loading}>
					Enregistrer
				</Button>
			)}
		</div>
	);
};

Setting.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	initialValue: PropTypes.object,
	isMedia: PropTypes.bool,
};

export default Setting;