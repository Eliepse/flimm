import PropTypes from "prop-types";
import { Button, Empty, message, Select, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { optionalArr } from "lib/support/arrays";
import styles from "./FilmListInput.module.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { optionFn } from "lib/support/functions";

const FilmListInput = ({ value, onChange, ...rest }) => {
	// Store the data of the selected films to display as a list (otherwise we only have the ids)
	const valueData = useRef({});

	const [searchText, setSearchText] = useState("");
	const [searchFilms, setSearchFilms] = useState([]);
	const [options, setOptions] = useState();
	const [loading, setLoading] = useState(true);

	/*
	 | ************************
	 | Search
	 | ************************
	 */

	useEffect(() => {
		setLoading(true);

		const request = searchText.length === 0 ? apiFilm.all() : apiFilm.search({ title: searchText });

		request
			.then(setSearchFilms)
			.catch(() => message.error("Erreur de la recherche de films"))
			.finally(() => setLoading(false));
	}, [searchText]);

	useEffect(() => {
		const filteredFilms = value?.length > 0 ? searchFilms.filter((f) => !value.includes(f.id)) : searchFilms;
		setOptions(filteredFilms.map((f) => ({ label: f.title, value: `${f.id}` })));

		// Update the data to display
		const previousAndNewFilms = [...Object.values(valueData.current), ...searchFilms];
		valueData.current = previousAndNewFilms.reduce((data, film) => {
			if (!value?.includes(film.id)) {
				return data;
			}

			return { ...data, [film.id]: film };
		}, {});
	}, [searchFilms, value]);

	/*
	 | ************************
	 | Actions
	 | ************************
	 */

	function addFilm(id) {
		if (value?.includes(id)) {
			return;
		}

		onChange([...optionalArr(value), id]);
	}

	function removeFilm(id) {
		delete valueData.current[id];
		onChange(optionalArr(value).filter((_id) => _id !== id));
	}

	/*
	 | ************************
	 | Events handlers
	 | ************************
	 */

	function handleSearch(text) {
		setSearchText(text.trim());
	}

	function handleSelect(selectedValue) {
		setSearchText("");
		addFilm(Number(selectedValue));
	}

	/*
	 | ************************
	 | Render
	 | ************************
	 */

	return (
		<div>
			<Select
				disabled={!options || rest.disabled}
				loading={loading}
				showSearch
				onSearch={handleSearch}
				options={options}
				filterOption={false}
				onSelect={handleSelect}
				value=""
			/>
			<div className={styles.listWrapper}>
				{optionalArr(value).length > 0 ? (
					<table className={styles.list}>
						<tbody>
							{optionalArr(value).map((id) => {
								const film = valueData.current[id];
								return film ? (
									<FilmRow key={id} id={id} title={film.title} onDelete={removeFilm} />
								) : (
									<LoadingRow key={id} />
								);
							})}
						</tbody>
					</table>
				) : (
					<Empty className="my-8 mx-16" image={Empty.PRESENTED_IMAGE_SIMPLE} description="Cherchez et ajouter un film pour commencer cette sélection" />
				)}
			</div>
		</div>
	);
};

const FilmRow = ({ id, title, onDelete }) => (
	<tr>
		<td>{title}</td>
		<td>
			<Button icon={<DeleteOutlined />} onClick={() => optionFn(onDelete)(id)} />
		</td>
	</tr>
);

const LoadingRow = () => (
	<tr>
		<td colSpan={2}>
			<Skeleton title paragraph={false} active />
		</td>
	</tr>
);

FilmRow.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	onDelete: PropTypes.func,
};

FilmListInput.propTypes = {
	value: PropTypes.array,
	onChange: PropTypes.func,
};

export default FilmListInput;
