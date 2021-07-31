import PropTypes from "prop-types";

const CustomPropTypes = {
	className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default CustomPropTypes;
