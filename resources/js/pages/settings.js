import Setting from "../components/Setting/Setting";
import { useEffect, useState } from "react";
import apiSettings from "../lib/api/apiSettings";
import styles from "./settings.module.scss";
import { message } from "antd";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";

export default function SettingsPage() {
	const [initalData, setInitalData] = useState({});

	useEffect(() => {
		apiSettings
			.all()
			.then((data) => {
				setInitalData(Object.fromEntries(data.map((setting) => [setting.name, setting])));
			})
			.catch((e) => {
				console.error(e);
				//noinspection JSIgnoredPromiseFromCall
				message.error("Erreur lors du chargement des paramètres.");
			});
	}, []);

	function handleSettingChanged(setting) {
		setInitalData((state) => ({ ...state, [setting.name]: setting }));
	}

	return (
		<TitleAndActionsLayout title="Paramètres">
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Général</h2>
				<Setting
					variant="textarea"
					label="Text additionel du bandeau d'en-tête"
					setting={initalData["header.text"]}
					onUpdate={handleSettingChanged}
				/>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Homepage</h2>
				<Setting
					variant="file"
					label="Image en avant"
					setting={initalData["homepage.featuredImage"]}
					onUpdate={handleSettingChanged}
				/>
				<Setting
					label="Description de l'image mise en avant"
					setting={initalData["homepage.featuredImage.altText"]}
					onUpdate={handleSettingChanged}
				/>
				<Setting
					label="Lien de l'image mise en avant"
					setting={initalData["homepage.featuredImage.link"]}
					onUpdate={handleSettingChanged}
				/>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Réseaux</h2>
				<Setting label="Facebook" setting={initalData["socials.facebook"]} onUpdate={handleSettingChanged} />
				<Setting label="Instagram" setting={initalData["socials.instagram"]} onUpdate={handleSettingChanged} />
				<Setting
					label="Lien vers la newsletter"
					setting={initalData["newsletter.link"]}
					onUpdate={handleSettingChanged}
				/>
			</section>
		</TitleAndActionsLayout>
	);
}
