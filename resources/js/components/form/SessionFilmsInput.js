import { Button, Input, Select, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { optionalArr } from "lib/support/arrays";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const SessionFilmsInput = ({ value, onChange }) => {
	const [films, setFilms] = useState({});

	useEffect(() => {
		apiFilm
			.all()
			.then((data) => setFilms(Object.fromEntries(data.map((f) => [f.id, f]))))
			.catch(console.error);
	}, []);

	const FILM_TABLE_COLUMNS = [
		{ title: "Titre", dataIndex: "title" },
		{ title: "Réalisateur", dataIndex: "filmmaker" },
		{ title: "Durée", dataIndex: "duration", render: (duration) => `${duration} min` },
		{
			width: 64,
			render: (film) => (
				<>
					<Button icon={<DeleteOutlined />} onClick={() => removeFilm(film.id)} />
				</>
			),
		},
	];

	const filmsTableData = useMemo(() => optionalArr(value).map((id) => films[id] || {}), [value, films]);

	function addFilm(id) {
		const list = optionalArr(value);
		//noinspection EqualityComparisonWithCoercionJS
		if (!id || list.find((i) => i == id)) {
			return;
		}

		onChange([...list, id]);
	}

	function removeFilm(id) {
		//noinspection EqualityComparisonWithCoercionJS
		onChange(optionalArr(value).filter((v) => v != id));
	}

	return (
		<div>
			<FilmsSelect films={films} excludedIds={value || []} onAddFilm={addFilm} />
			<Table className="my-2" columns={FILM_TABLE_COLUMNS} dataSource={filmsTableData} pagination={false} />
		</div>
	);
};

function filterOptions(input, option) {
	return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const FilmsSelect = ({ films, onAddFilm, excludedIds }) => {
	const [value, setValue] = useState();

	const options = useMemo(() => {
		//noinspection EqualityComparisonWithCoercionJS
		return Object.entries(films)
			.filter(([k]) => excludedIds.findIndex((id) => id === k) === -1)
			.map(([, f]) => ({
				label: `${f.title} - ${f.filmmaker}`,
				value: f.id,
			}));
	}, [excludedIds, films]);

	function selectFilm() {
		onAddFilm(value);
		setValue(undefined);
	}

	function onSelect(id) {
		setValue(id);
	}

	return (
		<Input.Group className="flex">
			<Select
				filterOption={filterOptions}
				onSelect={onSelect}
				className="flex-1 mr-2"
				options={options}
				value={value}
				placeholder="Rechercher un film"
				showSearch
			/>
			<Button type="primary" icon={<PlusOutlined />} onClick={selectFilm}>
				Add
			</Button>
		</Input.Group>
	);
};

FilmsSelect.propTypes = {
	films: PropTypes.arrayOf(PropTypes.object).isRequired,
	onAddFilm: PropTypes.func.isRequired,
	excludedIds: PropTypes.array.isRequired,
};

export default SessionFilmsInput;
