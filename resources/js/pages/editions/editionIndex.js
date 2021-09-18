import DashboardLayout from "components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { Button, Card, IconLinkExternal } from "hds-react";
import { Link } from "app";
import apiEdition from "lib/api/apiEdition";

const EditionIndexPage = () => {
	const [editions, setEditions] = useState([]);

	useEffect(() => {
		apiEdition.all().then(setEditions).catch(console.error);
	}, []);

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<h1>Editions</h1>
				<div>
					<Link to="/editions/create">
						<Button type="primary">Nouveau</Button>
					</Link>
				</div>
			</div>
			<ul>
				{editions.map((edition) => (
					<li key={edition.id} className="mb-6">
						<Card
							heading={
								<>
									<div>{edition.title}</div>
									{/*<div className="text-base text-gray-500 font-normal">{edition.filmmaker}</div>*/}
								</>
							}
							//text={edition.synopsis}
							border
						>
							<Link to={`/editions/${edition.id}`}>
								<Button>Edit</Button>
							</Link>
							<a href={`/editions/${edition.slug}`} target="_blank" className="mt-4 flex items-center" rel="noreferrer">
								Voir la page
								<IconLinkExternal className="ml-2" />
							</a>
						</Card>
					</li>
				))}
			</ul>
		</DashboardLayout>
	);
};

export default EditionIndexPage;
