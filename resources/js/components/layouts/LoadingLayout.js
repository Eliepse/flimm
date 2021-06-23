import {LoadingSpinner} from 'hds-react';

export default function LoadingLayout() {
	return (
		<div className="flex justify-center items-center h-screen">
			<LoadingSpinner/>
		</div>
	);
}