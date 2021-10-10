import DashboardLayout from "components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { Link } from "app";
import { Button, Table } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const COLUMNS = [
	{
		title: "title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Réalisateur",
		dataIndex: "filmmaker",
		key: "filmmaker",
	},
	{
		key: "actions",
		width: 200,
		render: (film) => <ActionsCell film={film} />,
	},
];

const FilmIndexPage = () => {
	const [films, setFilms] = useState([]);

	useEffect(() => {
		apiFilm.all().then(setFilms).catch(console.error);
	}, []);

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center">
				<h1>Films</h1>
				<div>
					<Link to="/films/create">
						<Button icon={<PlusOutlined />} type="primary">
							Nouveau
						</Button>
					</Link>
				</div>
			</div>
			<Table dataSource={films.map((film) => ({ ...film, key: film.id }))} columns={COLUMNS} pagination={false} />
		</DashboardLayout>
	);
};

const ActionsCell = ({ film }) => (
	<>
		<Link key="edit" to={`/films/${film.id}`}>
			<Button size="small" type="primary" icon={<EditOutlined />} className="mr-2">
				Editer
			</Button>
		</Link>
		<Button
			key="view"
			size="small"
			type="link"
			href={`/films/${film.slug}`}
			rel="noreferrer"
			target="_blank"
			icon={<EyeOutlined />}
		>
			Afficher
		</Button>
	</>
);

ActionsCell.propTypes = {
	film: PropTypes.object,
};

export default FilmIndexPage;
