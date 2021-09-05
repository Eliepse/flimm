import { Button, DatePicker, Form, Modal, Select, Table } from "antd";
import { VideoCameraAddOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";

const COLUMNS = [
	{
		title: "Film",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Réalisateur",
		dataIndex: "filmmaker",
		key: "filmmaker",
	},
	{
		title: "Heure de début",
		dataIndex: "start_at",
		key: "start_at",
	},
];

const FilmSchedulesInput = ({ id, onChange, value = [], films = [], open_at, close_at, ...rest }) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const tableColumns = [
		...COLUMNS,
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
		},
	];

	const tableData = useMemo(() => {
		let newScheduleAutoincrement = -1;
		const filmRepo = Object.fromEntries(films.map((film) => [film.id, film]));

		return (
			value
				//.sort((a, b) => a.start_at < b.start_at)
				.map((schedule) => {
					let key = schedule.id || newScheduleAutoincrement;
					const film = filmRepo[schedule.film_id];

					if (key < 0) {
						newScheduleAutoincrement--;
					}

					return {
						key,
						title: film.title,
						filmmaker: film.filmmaker,
						start_at: schedule.start_at.format("D MMM à HH [h] mm"),
						actions: <Button onClick={() => removeSchedule(schedule)}>Supprimer</Button>,
					};
				})
		);
	}, [value, films]);

	/*
	| -------------------------------------------------
	| Actions
	| -------------------------------------------------
	*/

	function addSchedule(film_id, start_at) {
		if (!film_id || !start_at) {
			return;
		}

		onChange([...value, { id: null, film_id, start_at }]);
	}

	function removeSchedule(id) {
		onChange(value.filter((v) => v !== id));
	}

	/*
	| -------------------------------------------------
	| Events handles
	| -------------------------------------------------
	*/

	function handleModalConfirm() {
		setIsModalVisible(false);
		addSchedule(form.getFieldValue("film"), form.getFieldValue("time"));
	}

	/*
	| -------------------------------------------------
	| Render
	| -------------------------------------------------
	*/

	function checkDateAvailable(date) {
		return !date.isBetween(open_at, close_at, "day", "[]");
	}

	return (
		<div>
			<Button
				className="mb-2"
				icon={<VideoCameraAddOutlined />}
				disabled={!open_at || !close_at}
				onClick={() => setIsModalVisible(true)}
			>
				Ajouter une scéance
			</Button>

			{(!open_at || !close_at) && (
				<p className="text-yellow-400 mb-2">
					Pour ajouter des scéances, renseignez les dates de début et de fin de l&apos;édition.
				</p>
			)}

			<Table dataSource={tableData} columns={tableColumns} pagination={false} />

			<Modal visible={isModalVisible} closable onOk={handleModalConfirm}>
				<Form form={form} layout="vertical">
					<Form.Item label="Présentation" className="mb-6" name="film">
						<Select optionLabelProp="label">
							{films.map((film) => (
								<Select.Option key={film.id} label={film.title} value={film.id}>
									{film.title}, {film.filmmaker}, {film.year}, {film.duration}&apos;
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="Début de la scéance" className="mb-6" name="time">
						<DatePicker showTime disabledDate={checkDateAvailable} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default FilmSchedulesInput;
