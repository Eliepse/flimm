import { Button, Input, Select, Table } from "antd";
import { useMemo, useState } from "react";
import { optionalArr } from "lib/support/arrays";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getFilms, getFilmsList } from "reducers/filmsSlice";

const SessionFilmsInput = ({ value, onChange }) => {
	const films = useSelector(getFilms);

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
			<FilmsSelect excludedIds={value || []} onAddFilm={addFilm} />
			<Table className="my-2" columns={FILM_TABLE_COLUMNS} dataSource={filmsTableData} pagination={false} />
		</div>
	);
};

function filterOptions(input, option) {
	return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const FilmsSelect = ({ onAddFilm, excludedIds }) => {
	const films = useSelector(getFilmsList);
	const [value, setValue] = useState();

	const options = useMemo(() => {
		//noinspection EqualityComparisonWithCoercionJS
		return films
			.filter((film) => !excludedIds.includes(film.id))
			.map((film) => ({
				label: `${film.title} - ${film.filmmaker}`,
				value: film.id,
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
	onAddFilm: PropTypes.func.isRequired,
	excludedIds: PropTypes.array.isRequired,
};

export default SessionFilmsInput;
