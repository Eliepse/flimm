import {Navigation} from 'hds-react';
import {useContext} from 'react';
import {authContext} from '../../lib/auth/authProvider';

export default function DashboardLayout({children}) {
	const {user, logout} = useContext(authContext);

	return (
		<div className="flex flex-col min-h-screen">
			<Navigation
				title="FLiMM"
				menuToggleAriaLabel="menu"
				skipTo="#content"
				skipToContentLabel="Skip to content"
			>
				<Navigation.Row variant="inline">
					<Navigation.Item label="Admin" href="/admin" active/>
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
}