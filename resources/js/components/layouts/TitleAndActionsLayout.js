import PropTypes from "prop-types";
import DashboardLayout from "components/layouts/DashboardLayout";

const TitleAndActionsLayout = ({ title, actions, children }) => {
	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-xl font-medium">{title}</h1>
				{actions && <div>{actions}</div>}
			</div>
			{children}
		</DashboardLayout>
	);
};

TitleAndActionsLayout.propTypes = {
	title: PropTypes.any.isRequired,
	actions: PropTypes.any,
	children: PropTypes.any,
};

export default TitleAndActionsLayout;
