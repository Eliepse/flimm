import { Spin } from "antd";

export default function LoadingLayout() {
	return (
		<div className="flex justify-center items-center h-screen">
			<Spin size="large" tip="Chargement en cours..." />
		</div>
	);
}
