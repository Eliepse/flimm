import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { EditOutlined, FileOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Skeleton, Upload } from "antd";
import { getFilename } from "lib/support/files";
import { nl2br } from "lib/support/strings.jsx";
import { noPropagation } from "lib/support/events";
import apiSettings from "lib/api/apiSettings";

const STATE_INIT = "initializing";
const STATE_SAVING = "saving";
const STATE_DISPLAY = "display";
const STATE_EDIT = "edit";

const Setting = ({ label, setting, variant = "text", onUpdate }) => {
	const [state, setState] = useState(STATE_INIT);

	useEffect(() => {
		setState((state) => {
			if (STATE_INIT === state && setting) {
				return STATE_DISPLAY;
			}

			if (STATE_INIT !== state && !setting) {
				return STATE_INIT;
			}

			return state;
		});
	}, [setting]);

	function handleCancelEdit() {
		setState(STATE_DISPLAY);
	}

	function saveSetting({ value }) {
		setState(STATE_SAVING);
		apiSettings
			.upsert({ name: setting.name, value })
			.then(({ data }) => {
				onUpdate(data);
				setState(STATE_DISPLAY);
				//noinspection JSIgnoredPromiseFromCall
				message.success("Paramètre mis à jour !");
			})
			.catch((e) => {
				console.error(e);
				//noinspection JSIgnoredPromiseFromCall
				message.error("Erreur lors de l'enregistrement");
			});
	}

	function activateEditMode() {
		setState(STATE_EDIT);
	}

	return (
		<div className="mb-6">
			<label className="flex items-center h-8 font-bold mb-1">
				{label}
				{STATE_DISPLAY === state && <Button icon={<EditOutlined />} type="link" onClick={activateEditMode} />}
			</label>
			{STATE_INIT === state && <Skeleton paragraph={false} active />}
			{STATE_DISPLAY === state && <SettingDisplay setting={setting} variant={variant} />}
			{[STATE_EDIT, STATE_SAVING].includes(state) && (
				<SettingEdit
					setting={setting}
					variant={variant}
					saving={STATE_SAVING === state}
					onCancel={handleCancelEdit}
					onSubmit={saveSetting}
				/>
			)}
		</div>
	);
};

const SettingDisplay = ({ setting, variant = "text" }) => {
	if (!setting.value) {
		return <p className="font-mono text-sm text-gray-400">No data</p>;
	}

	return (
		<div>
			{"file" === variant && (
				<a href={setting.value} rel="nofollow noreferrer" target="_blank">
					<FileOutlined /> {getFilename(setting.value)}
				</a>
			)}
			{["text", "textarea"].includes(variant) && <p>{nl2br(setting.value)}</p>}
		</div>
	);
};

const SettingEdit = ({ setting, variant = "text", saving = false, onCancel, onSubmit }) => {
	const isFileVariant = variant === "file";
	const [value, setValue] = useState(formatValue(setting.value));
	const [isDirty, setIsDirty] = useState(false);

	/**
	 * @param {String|*} value
	 * @returns {String|File[]|Object[]|*}
	 */
	function formatValue(value) {
		if (isFileVariant) {
			return value ? [{ name: getFilename(value), uid: value, thumbUrl: value, status: "done" }] : [];
		}

		return value;
	}

	function submit() {
		if (!isDirty) {
			return;
		}

		const updateValue = isFileVariant ? value[0]?.originFileObj : value;
		onSubmit({ ...setting, value: updateValue });
	}

	/** @param {InputEvent|{file:File|Object[], fileList:File[]|Object[]}} event */
	function handleChange(event) {
		setIsDirty(true);

		if (isFileVariant) {
			setValue(event.fileList);
			return;
		}

		setValue(event.target.value);
	}

	const actions = (
		<div>
			<Button onClick={noPropagation(onCancel)} disabled={saving} className="mr-2">
				Annuler
			</Button>
			{isDirty && (
				<Button type="primary" disabled={saving} onClick={noPropagation(submit)}>
					Enregistrer
				</Button>
			)}
		</div>
	);

	if (isFileVariant) {
		return (
			<div className="mt-2">
				<div className="mb-2">
					<Upload
						maxCount={1}
						fileList={value}
						onChange={handleChange}
						beforeUpload={() => false}
						listType="picture"
						disabled={saving}
						showCount
					>
						<Button icon={<UploadOutlined />} disabled={saving}>
							Charger un fichier
						</Button>
					</Upload>
				</div>
				{actions}
			</div>
		);
	}

	if ("textarea" === variant) {
		return (
			<div className="mt-2">
				<Input.TextArea
					maxLength={500}
					value={value}
					onChange={handleChange}
					className="mb-2"
					placeholder="Entrez votre texte ici"
					showCount
					disabled={saving}
				/>
				{actions}
			</div>
		);
	}

	return (
		<div className="mt-2">
			<Input
				maxLength={250}
				value={value}
				onChange={handleChange}
				className="mb-2"
				placeholder="Entrez votre texte ici"
				disabled={saving}
			/>
			{actions}
		</div>
	);
};

Setting.propTypes = {
	label: PropTypes.string.isRequired,
	setting: PropTypes.shape({
		name: PropTypes.string.isRequired,
		value: PropTypes.any,
	}),
	variant: PropTypes.oneOf(["text", "textarea", "file"]),
	onUpdate: PropTypes.func.isRequired,
};

SettingDisplay.propTypes = {
	setting: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.any,
	}),
	variant: Setting.propTypes.variant,
};

SettingEdit.propTypes = {
	setting: PropTypes.shape({
		value: PropTypes.any,
	}),
	variant: Setting.propTypes.variant,
	saving: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default Setting;
