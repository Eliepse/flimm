import {Header, HeaderName} from 'carbon-components-react';

export default function DashboardLayout({children}) {
	return (
		<div className="flex flex-col pt-12 px-6 min-h-screen">
			<Header>
				<HeaderName href="/admin" prefix="FLiMM">Admin</HeaderName>
			</Header>
			<div className="flex-auto w-full mx-auto max-w-6xl">{children}</div>
			<footer className="py-4 w-full mx-auto max-w-6xl">
				<p className="text-xs text-gray-400 text-center">FLiMM Dashboard</p>
			</footer>
		</div>
	);
}