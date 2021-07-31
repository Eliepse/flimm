import { useRef } from "react";
import clsx from "clsx";
import styles from "./FileInput.module.scss";
import { IconCrossCircle } from "hds-react";
import CustomPropTypes from "lib/customProptypes";
import PropTypes from "prop-types";

//noinspection JSCommentMatchesSignature
/**
 * @param {File} value
 */
const FileInput = ({
	className = "",
	defaultValue,
	errorText,
	helperText,
	invalid,
	id,
	label,
	onChange,
	name,
	value = undefined,
	...rest
}) => {
	const inputRef = useRef();

	function clearInput() {
		inputRef.current.value = "";
		onChange({ target: inputRef.current });
	}

	function getFormattedValue() {
		if (!value) {
			return "";
		}

		if (typeof value === "string") {
			return <img src={value} className="h-10 w-auto" alt="" />;
		}

		return value?.name;
	}

	return (
		<div className={clsx(styles.root, "hds-text-input", invalid && "hds-text-input--invalid", className)}>
			<label htmlFor={id}>
				<div className="hds-text-input__label">{label}</div>
				<div className={clsx("hds-text-input__input-wrapper cursor-pointer", styles.inputWrapper)}>
					<div className={clsx("hds-text-input__input flex items-center", styles.input)}>{getFormattedValue()}</div>
					{value && (
						<div className="TextInput-module_buttonWrapper___filA text-input_hds-text-input__buttons__1RMzT">
							<button
								className="TextInput-module_button__1ySMX text-input_hds-text-input__button__1Fh0I"
								type="button"
								aria-label="Remove image"
								onClick={clearInput}
							>
								<IconCrossCircle className="Icon-module_icon__1Jtzj icon_hds-icon__1YqNC Icon-module_s__2WGWe icon_hds-icon--size-s__2Lkik" />
							</button>
						</div>
					)}
					<input
						ref={inputRef}
						id={id}
						type="file"
						name={name}
						defaultValue={defaultValue}
						hidden
						onChange={onChange}
						{...rest}
					/>
				</div>
			</label>
			{invalid && <span className="hds-text-input__error-text">{errorText}</span>}
			{helperText && <span className="hds-text-input__helper-text">{helperText}</span>}
		</div>
	);
};

FileInput.propTypes = {
	className: CustomPropTypes.className,
	defaultValue: PropTypes.string,
	errorText: PropTypes.string,
	helperText: PropTypes.string,
	invalid: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default FileInput;
