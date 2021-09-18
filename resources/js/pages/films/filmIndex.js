import DashboardLayout from "components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { Button, Card, IconLinkExternal } from "hds-react";
import { Link } from "app";

const FilmIndexPage = () => {
	const [films, setFilms] = useState([]);

	useEffect(() => {
		apiFilm.all().then(setFilms).catch(console.error);
	}, []);

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<h1>Films</h1>
				<div>
					<Link to="/films/create">
						<Button type="primary">Nouveau</Button>
					</Link>
				</div>
			</div>
			<ul>
				{films.map((film) => (
					<li key={film.id} className="mb-6">
						<Card
							heading={
								<>
									<div>{film.title}</div>
									<div className="text-base text-gray-500 font-normal">{film.filmmaker}</div>
								</>
							}
							text={film.synopsis}
							border
						>
							<Link to={`/films/${film.id}`}>
								<Button>Edit</Button>
							</Link>
							<a href={`/films/${film.slug}`} target="_blank" className="mt-4 flex items-center" rel="noreferrer">
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

export default FilmIndexPage;
