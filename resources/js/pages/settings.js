import DashboardLayout from "../components/layouts/DashboardLayout";
import Setting from "../components/Setting/Setting";
import { useEffect, useState } from "react";
import LoadingLayout from "../components/layouts/LoadingLayout";
import apiSettings from "../lib/api/apiSettings";
import styles from "./settings.module.scss";

export default function SettingsPage() {
	const [initalData, setInitalData] = useState();

	useEffect(() => {
		apiSettings
			.all()
			.then((data) => {
				setInitalData(
					data.reduce(
						(acc, setting) => ({ ...acc, [setting.name]: setting }),
						{}
					)
				);
			})
			.catch(console.error);
		setInitalData({});
	}, []);

	if (initalData === undefined) {
		return <LoadingLayout />;
	}

	return (
		<DashboardLayout>
			<h1 className="border-b-2 border-solid border-gray-200 pb-2">
				Paramètres
			</h1>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Homepage</h2>
				<Setting
					label="Image en avant"
					name="homepage.featuredImage"
					initialValue={initalData["homepage.featuredImage"]}
					isMedia
				/>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Réseaux</h2>
				<Setting
					label="Facebook"
					name="social.facebook"
					initialValue={initalData["social.facebook"]}
				/>
				<Setting
					label="Instagram"
					name="social.instagram"
					initialValue={initalData["social.instagram"]}
				/>
			</section>
		</DashboardLayout>
	);
}