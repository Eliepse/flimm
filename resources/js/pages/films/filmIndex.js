import { useEffect, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { Link } from "app";
import { Badge, Button, message, Table } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";

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
		apiFilm
			.all()
			.then(setFilms)
			.catch((e) => {
				console.error(e);
				//noinspection JSIgnoredPromiseFromCall
				message.error("Erreur lors du chargement des films.");
			});
	}, []);

	const title = (
		<span className="inline-flex items-center">
			Films
			<Badge
				count={films.length}
				overflowCount={99999}
				className="ml-2"
				style={{
					backgroundColor: "#f3f4f6",
					color: "#4b5563",
				}}
			/>
		</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			actions={
				<Link to="/films/create">
					<Button icon={<PlusOutlined />} type="primary">
						Nouveau
					</Button>
				</Link>
			}
		>
			<Table dataSource={films.map((film) => ({ ...film, key: film.id }))} columns={COLUMNS} pagination={false} />
		</TitleAndActionsLayout>
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
