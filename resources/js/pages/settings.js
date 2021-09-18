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
				<h2 className={styles.sectionTitle}>Général</h2>
				<Setting
					variant="textarea"
					label="Text additionel du bandeau d'en-tête"
					name="header.text"
					initialValue={initalData["header.text"]}
				/>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Homepage</h2>
				<Setting
					variant="file"
					label="Image en avant"
					name="homepage.featuredImage"
					initialValue={initalData["homepage.featuredImage"]}
				/>
				<Setting
					label="Description de l'image mise en avant"
					name="homepage.featuredImage.altText"
					initialValue={initalData["homepage.featuredImage.altText"]}
				/>
				<Setting
					label="Lien de l'image mise en avant"
					name="homepage.featuredImage.link"
					initialValue={initalData["homepage.featuredImage.link"]}
				/>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Réseaux</h2>
				<Setting
					label="Facebook"
					name="socials.facebook"
					initialValue={initalData["socials.facebook"]}
				/>
				<Setting
					label="Instagram"
					name="socials.instagram"
					initialValue={initalData["socials.instagram"]}
				/>
				<Setting
					label="Lien vers la newsletter"
					name="newsletter.link"
					initialValue={initalData["newsletter.link"]}
				/>
			</section>
		</DashboardLayout>
	);
}