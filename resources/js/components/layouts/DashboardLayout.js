import {Navigation} from 'hds-react';

export default function DashboardLayout({children}) {
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
			</Navigation>
			<div className="flex-auto w-full pt-6 mx-auto max-w-6xl">{children}</div>
		</div>
	);
}