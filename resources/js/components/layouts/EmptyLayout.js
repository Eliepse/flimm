import PropTypes from "prop-types";

const EmptyLayout = ({ children }) => {
	return <div className="px-6 min-h-screen">{children}</div>;
};

EmptyLayout.propTypes = {
	children: PropTypes.any,
};

export default EmptyLayout;
