import { Spin } from "antd";
import PropTypes from "prop-types";

export default function LoadingLayout({ text }) {
	return (
		<div className="flex justify-center items-center h-screen">
			<Spin size="large" tip={text || "Chargement en cours..."} />
		</div>
	);
}

LoadingLayout.propTypes = {
	text: PropTypes.string,
};
