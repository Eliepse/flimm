import DashboardLayout from "../components/layouts/DashboardLayout";
import { Alert } from "antd";

export default function HomePage() {
	return (
		<DashboardLayout>
			<Alert
				message="L'administration est toujours en développement."
				description={
					<>
						Si vous rencontrez un problème, vous pouvez{" "}
						<a className="underline" href="mailto:contact@eliepse.fr">
							me contacter
						</a>{" "}
						pour me l&apos;expliquer. 😊
					</>
				}
				type="info"
				showIcon
			/>
		</DashboardLayout>
	);
}
