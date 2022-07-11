import { useParams } from "react-router-dom";
import { Button, DatePicker, Divider, Form, Input, InputNumber, Select } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import RichtextEditorInput from "components/inputs/RichtextEditorInput";
import DashboardLayout from "components/layouts/DashboardLayout";
import { useMachine } from "lib/hooks/useMachine";
import sessionEditorMachine, { MODE } from "lib/stateMachines/sessionEditorMachine";
import { useEffect, useMemo, useState } from "react";
import apiEdition from "lib/api/apiEdition";
import { optionalArr } from "lib/support/arrays";
import SessionFilmsInput from "components/inputs/SessionFilmsInput";
import { useRouter } from "lib/useRouter";

function filterEditionOptions(input, option) {
	return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const SessionEditorPage = () => {
	const { id } = useParams();
	const [form] = Form.useForm();
	const [editions, setEditions] = useState();
	const { pushAdmin } = useRouter();

	const { context, isState, send, state } = useMachine(
		sessionEditorMachine,
		{
			id,
			mode: id ? MODE.edit : MODE.create,
		},
		true
	);
	const { data } = context;

	useEffect(() => {
		if (state === "updateForm") {
			form.setFieldsValue(context.data);
			send("done");
		}

		//eslint-disable-next-line
	}, [form, send, state]);

	useEffect(() => {
		if (data.id && !id) {
			pushAdmin(`/sessions/${data.id}`);
		}
	}, [data, id, pushAdmin]);

	useEffect(() => {
		apiEdition.all().then(setEditions).catch(console.error);
	}, []);

	const editionsSelectOptions = useMemo(() => {
		return optionalArr(editions).map((e) => ({ label: e.title, value: e.id }));
	}, [editions]);

	return (
		<DashboardLayout>
			<Form layout="vertical" form={form} className="grid grid-cols-3">
				{/*
					| -------------------------------------------------
					| Main fields
					| -------------------------------------------------
					*/}
				<div className="col-span-2 px-4">
					<Form.Item label="Titre" className="mb-6" name="title" rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Films" name="films" className="mt-6">
						<SessionFilmsInput />
					</Form.Item>

					<Divider className="mb-6" />

					<Form.Item label="Description" name="description" className="mt-6">
						{isState("init") ? (
							<p>Vous devez d&apos;abord enregistrer la session avant de pouvoir éditer le contenu.</p>
						) : (
							<RichtextEditorInput
								imageEndpoint={`${location.protocol}//${location.host}/api/sessions/${id}/media`}
								loading={isState("init")}
								className="relative py-4 mt-6 border-2 border-solid border-gray-300"
							/>
						)}
					</Form.Item>
				</div>

				{/*
					| -------------------------------------------------
					| Secondary fields
					| -------------------------------------------------
					*/}
				<aside className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">
						<Form.Item label="Lieu / Salle" className="mb-6" name="location" rules={[{ required: true }]}>
							<Input />
						</Form.Item>

						<Form.Item label="Durée" className="mb-6" name="duration" rules={[{ required: true }]}>
							<InputNumber addonAfter="min" />
						</Form.Item>

						<Form.Item label="Édition liée" className="mb-6" name="edition_id">
							<Select
								loading={!editions}
								options={editionsSelectOptions}
								filterOption={filterEditionOptions}
								showSearch
								allowClear
							/>
						</Form.Item>

						<Divider />

						<Form.Item label="Horaire de début" className="mb-6" name="start_at" rules={[{ required: true }]}>
							<DatePicker showTime />
						</Form.Item>

						<Divider />

						{/* Actions */}
						<div className="mt-8">
							<Button
								type="primary"
								htmlType="submit"
								className="mr-4"
								loading={isState("submit")}
								onClick={() => send("save", form.getFieldsValue())}
							>
								{isState("submit") ? "Sauvegarde en cours..." : "Sauvegarder"}
							</Button>
							{data.slug && (
								<Button icon={<GlobalOutlined />} href={`/editions/${data.slug}`} target="_blank" rel="noreferrer">
									Voir la page
								</Button>
							)}
						</div>
					</div>
				</aside>
			</Form>
		</DashboardLayout>
	);
};

SessionEditorPage.propTypes = {};

export default SessionEditorPage;
