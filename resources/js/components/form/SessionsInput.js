import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Button, DatePicker, Form, InputNumber, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import SessionFilmsInput from "components/form/SessionFilmsInput";
import { optionalArr } from "lib/support/arrays";
import { useSelector } from "react-redux";
import { getFilms } from "reducers/filmsSlice";

const SessionsInput = ({ value = [], onChange }) => {
	const films = useSelector(getFilms);
	const [modal, setModal] = useState();

	/*
	| -------------------
	| Events handlers
	| -------------------
	*/

	const onFinishSession = useCallback(
		(session, key) => {
			if (key === undefined) {
				onChange([...value, session]);
				closeModalSession();
				return;
			}

			value.splice(key, 1, session);
			onChange([...value]);
			closeModalSession();
		},
		[onChange, value]
	);

	/*
	| -------------------
	| Actions
	| -------------------
	*/

	function openModalSession() {
		//noinspection JSCheckFunctionSignatures
		setModal(<SessionModal onFinish={onFinishSession} onCancel={closeModalSession} visible />);
	}

	function closeModalSession() {
		setModal(undefined);
	}

	const deleteSession = useCallback((key) => onChange(value.filter((_, i) => i !== key)), [onChange, value]);

	/*
	| -------------------
	| Render
	| -------------------
	*/

	const columns = useMemo(
		() => [
			{
				title: "Films",
				dataIndex: "films",
				render: (ids) => optionalArr(ids).map((id) => <div key={id}>{films[id]?.title}</div>),
			},
			{
				title: "Horaire",
				render: (_, record) => (
					<>
						<div>{record.duration} min</div>
						<div>{record.start_at.format("D/MM/YYYY HH:mm")}</div>
					</>
				),
			},
			{
				align: "right",
				render: (_, record, i) => {
					function editSession() {
						//noinspection JSCheckFunctionSignatures
						setModal(
							<SessionModal
								index={i}
								session={record}
								onFinish={onFinishSession}
								onCancel={closeModalSession}
								visible
							/>
						);
					}

					return <SessionTableActions onEdit={editSession} onDelete={() => deleteSession(i)} />;
				},
			},
		],
		[onFinishSession, deleteSession, films]
	);

	return (
		<div>
			<Table
				columns={columns}
				dataSource={value}
				pagination={false}
				size="small"
				footer={() => (
					<Button size="small" type="link" icon={<PlusOutlined />} onClick={openModalSession}>
						Ajouter une séance
					</Button>
				)}
			/>
			{modal}
		</div>
	);
};

const SessionModal = ({ index, session, onFinish, onCancel }) => {
	const [form] = Form.useForm();
	const isEdit = typeof index === "number";

	function handleOk() {
		form.submit();
	}

	function handleFinish(values) {
		onFinish(values, index);
	}

	return (
		<Modal
			title={isEdit ? "Modification d'une session" : "Ajout d'une session"}
			onOk={handleOk}
			onCancel={onCancel}
			destroyOnClose
			visible
		>
			<Form onFinish={handleFinish} layout="vertical" initialValues={session} form={form}>
				<Form.Item label="Horaire de début" name="start_at" rules={[{ required: true }]}>
					<DatePicker showTime />
				</Form.Item>

				<Form.Item label="Durée" name="duration" rules={[{ required: true }]}>
					<InputNumber min="1" />
				</Form.Item>

				<Form.Item label="Films" name="films" rules={[{ required: true }]}>
					<SessionFilmsInput />
				</Form.Item>
			</Form>
		</Modal>
	);
};

const SessionTableActions = ({ onEdit, onDelete }) => {
	return (
		<>
			<Button icon={<EditOutlined />} onClick={onEdit} className="mr-2" />
			<Button icon={<DeleteOutlined />} onClick={onDelete} />
		</>
	);
};

SessionsInput.propTypes = {
	value: PropTypes.arrayOf(
		PropTypes.shape({
			start_at: PropTypes.object,
			duration: PropTypes.number,
			films: PropTypes.arrayOf(PropTypes.number),
		})
	),
	onChange: PropTypes.func,
};

SessionModal.propTypes = {
	index: PropTypes.number,
	session: PropTypes.shape({
		start_at: PropTypes.object,
		duration: PropTypes.number,
		films: PropTypes.arrayOf(PropTypes.number),
	}),
	onFinish: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

SessionTableActions.propTypes = {
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default SessionsInput;
