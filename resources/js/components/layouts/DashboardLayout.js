import { Navigation } from "hds-react";
import { useContext } from "react";
import { authContext } from "lib/auth/authProvider";
import { Link } from "app";
import PropTypes from "prop-types";

const DashboardLayout = ({ children }) => {
	const { user, logout } = useContext(authContext);

	return (
		<div className="flex flex-col min-h-screen">
			<Navigation title="FLiMM" menuToggleAriaLabel="menu" skipTo="#content" skipToContentLabel="Skip to content">
				<Navigation.Row variant="inline">
					<Navigation.Item label="Dashboard" as={Link} href="/" />
					<Navigation.Item label="Articles" as={Link} href="/articles" />
					<Navigation.Item label="Films" as={Link} href="/films" />
					<Navigation.Item label="Editions" as={Link} href="/editions" />
					<Navigation.Item label="Paramètres" as={Link} href="/settings" />
				</Navigation.Row>
				<Navigation.Actions>
					<Navigation.User authenticated label="Se connecter" userName={user.firstname}>
						<Navigation.Item label="Se déconnecter" onClick={logout} />
					</Navigation.User>
				</Navigation.Actions>
			</Navigation>
			<div className="flex-auto w-full pt-6 mx-auto max-w-6xl">{children}</div>
		</div>
	);
};

DashboardLayout.propTypes = {
	children: PropTypes.any,
};

export default DashboardLayout;
