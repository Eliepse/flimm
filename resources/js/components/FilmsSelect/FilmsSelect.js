import { Select } from "antd";

const FilmsSelect = ({ id, value, onChange,  multiple = false, films = [], ...rest }) => {
	return (
		<Select mode="multiple" optionLabelProp="label" {...rest}>
			{films.map((film) => (
				<Select.Option key={film.id} label={film.title} value={film.id}>
					{film.title}, {film.filmmaker}, {film.year}, {film.duration}&apos;
				</Select.Option>
			))}
		</Select>
	);
};

export default FilmsSelect;
