import clsx from "clsx";
import styles from "./DateTimeInput.module.scss";
import DateTimePicker from "react-datetime-picker";
import PropTypes from "prop-types";
import CustomPropTypes from "lib/customProptypes";

const DateTimeInput = ({
	className = "",
	errorText,
	helperText,
	invalid,
	id,
	label,
	onChange,
	name,
	value = undefined,
}) => {
	function handleChange(e) {
		onChange({ target: { name, value: e } });
	}

	return (
		<div className={clsx(styles.root, "hds-text-input", invalid && "hds-text-input--invalid")}>
			<label htmlFor={id}>
				<div className="hds-text-input__label">{label}</div>
				<div className={clsx("hds-text-input__input-wrapper cursor-pointer", styles.inputWrapper, className)}>
					<DateTimePicker
						format="dd/MM/y HH:mm"
						maxDetail="minute"
						minDetail="year"
						className={clsx("hds-text-input__input flex items-center", styles.input)}
						onChange={handleChange}
						value={value}
					/>
				</div>
			</label>
			{invalid && <span className="hds-text-input__error-text">{errorText}</span>}
			{helperText && <span className="hds-text-input__helper-text">{helperText}</span>}
		</div>
	);
};

DateTimeInput.propTypes = {
	className: CustomPropTypes.className,
	errorText: PropTypes.string,
	helperText: PropTypes.string,
	invalid: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.instanceOf(Date),
	onChange: PropTypes.func,
};

export default DateTimeInput;
