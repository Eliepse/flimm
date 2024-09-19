import DashboardLayout from "@/components/layouts/DashboardLayout.jsx";
import { Alert, Button, Spin } from "antd";
import Api from "lib/api/broker.js";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const response = await Api.get("/dashboard");
			return response.data;
		},
	});

	return (
		<DashboardLayout>
			{isLoading && <Spin />}
			{data?.supportEmail && (
				<Alert
					message={`En cas de problème, merci de me contacter par mail: ${data.supportEmail}`}
					type="info"
					showIcon
				/>
			)}
			{data?.analyticsUrl && (
				<Alert
					message={
						<>
							Retrouvez les statistiques de fréquentation du site ici:
							<Button href={data.analyticsUrl} type="link" target="_blank">
								Statistiques
							</Button>
						</>
					}
					type="info"
					showIcon
					className="mt-4"
				/>
			)}
		</DashboardLayout>
	);
}
