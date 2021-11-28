import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, DatePicker, Divider, Form, Input, message, Skeleton, Upload } from "antd";
import { FileImageTwoTone, GlobalOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "lib/useRouter";
import { useEffect, useState } from "react";
import apiEdition from "lib/api/apiEdition";
import { normalizeOnUploadChanges } from "lib/support/forms";
import RichtextEditorInput from "components/form/RichtextEditorInput";
import slug from "slug";

const STATUS_INIT = "initializing";
const STATUS_IDLE = "idle";
const STATUS_SAVING = "saving";

const EditionEditorPage = () => {
	const { query, ...router } = useRouter();
	const isNew = query.id === undefined;
	const [edition, setEdition] = useState({});
	const [autoFilledSlug, setAutoFilledSlug] = useState(isNew);
	const [status, setStatus] = useState(STATUS_INIT);
	const [form] = Form.useForm();

	/*
	| -------------------------------------------------
	| Initialization
	| -------------------------------------------------
	 */

	useEffect(() => {
		if (isNew) {
			setStatus(STATUS_IDLE);
			return;
		}

		apiEdition
			.get(query.id)
			.then((data) => {
				form.setFieldsValue(data);
				// Slug has to be manually changed if article already in database
				setAutoFilledSlug(false);
				setEdition(data);
			})
			.catch(console.error)
			.finally(() => setStatus(STATUS_IDLE));
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
	| -------------------------------------------------
	| Events handlers
	| -------------------------------------------------
	 */

	function handleRichtextChange(data) {
		form.setFieldsValue({ presentation: data });
	}

	function handleSubmit(values) {
		setStatus(STATUS_SAVING);

		// The richtext éditor need manual get because it's not attached to an Form.Item
		const presentation = form.getFieldValue("presentation");
		const request = isNew ? apiEdition.create(values) : apiEdition.update({ id: query.id, presentation, ...values });

		request
			.then((data) => {
				// Redirect to the edition mode on success
				if (isNew) {
					message.success("Édition créée");
					router.pushAdmin(`/editions/${data.id}`);
				} else {
					form.setFieldsValue(data);
					message.success("Édition mise à jour");
					setStatus(STATUS_IDLE);
				}
			})
			.catch((e) => {
				console.error(e);
				setStatus(STATUS_IDLE);
			});
	}

	/*
	| -------------------------------------------------
	| Inputs Middlewares
	| -------------------------------------------------
	 */

	/** @param {InputEvent} event */
	function slugMiddleware(event) {
		if (autoFilledSlug) {
			setAutoFilledSlug(false);
		}

		return slug(event.target.value, { trim: false });
	}

	/** @param {InputEvent} event */
	function titleMiddleware(event) {
		if (autoFilledSlug) {
			form.setFieldsValue({ slug: slug(event.target.value, { trim: false }) });
		}

		return event.target.value;
	}

	/*
	| -------------------------------------------------
	| Render
	| -------------------------------------------------
	 */

	if (STATUS_INIT === status) {
		return (
			<DashboardLayout>
				<div className="grid grid-cols-3">
					<div className="col-span-2 px-4">
						<Skeleton active />
					</div>
					<aside className="col-span-1">
						<Skeleton active />
					</aside>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<Form layout="vertical" form={form} className="grid grid-cols-3" onFinish={handleSubmit}>
				{/*
					| -------------------------------------------------
					| Main fields
					| -------------------------------------------------
					*/}
				<div className="col-span-2 px-4">
					<Form.Item
						valuePropName="fileList"
						extra="Glissez/déposez une image ou cliquez pour en sélectionner une."
						getValueFromEvent={normalizeOnUploadChanges}
						name="thumbnail"
						rules={[{ required: true }]}
					>
						<Upload.Dragger
							beforeUpload={() => false}
							listType="picture-card"
							accept=".jpg,.jpeg,.png,.gif"
							maxCount={1}
						>
							<p className="ant-upload-drag-icon">
								<FileImageTwoTone />
							</p>
							<p className="ant-upload-text">Visuel principal</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item
						label="Titre"
						getValueFromEvent={titleMiddleware}
						extra="Le titre original du film"
						className="mb-6"
						name="title"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Slug"
						getValueFromEvent={slugMiddleware}
						className="mb-6"
						name="slug"
						rules={[{ required: true }]}
					>
						<Input addonBefore={`${location.origin}/editions/`} pattern="[0-9a-zA-Z-]+" />
					</Form.Item>

					<Divider className="mb-6" />

					<label>Présentation</label>
					<div className="relative py-4 mt-6 border-2 border-solid border-gray-300">
						{query.id ? (
							<RichtextEditorInput
								value={edition.presentation}
								onChange={handleRichtextChange}
								imageEndpoint={`${location.protocol}//${location.host}/api/editions/${query.id}/media`}
								loading={STATUS_INIT === status}
							/>
						) : (
							<p>Vous devez d&apos;abord enregistrer l&apos;édition avant de pouvoir éditer le contenu.</p>
						)}
					</div>
				</div>

				{/*
					| -------------------------------------------------
					| Secondary fields
					| -------------------------------------------------
					*/}
				<aside className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">
						<Form.Item
							label="Programme"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							name="program"
						>
							<Upload beforeUpload={() => false} listType="text" maxCount={1}>
								<Button icon={<UploadOutlined />}>Upload</Button>
							</Upload>
						</Form.Item>

						<Form.Item
							label="L'affiche"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							name="poster"
						>
							<Upload beforeUpload={() => false} listType="text" maxCount={1}>
								<Button icon={<UploadOutlined />}>Upload</Button>
							</Upload>
						</Form.Item>

						<Form.Item
							label="La brochure"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							name="brochure"
						>
							<Upload beforeUpload={() => false} listType="text" maxCount={1}>
								<Button icon={<UploadOutlined />}>Upload</Button>
							</Upload>
						</Form.Item>

						<Form.Item
							label="Le flyer"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							name="flyer"
						>
							<Upload beforeUpload={() => false} listType="text" maxCount={1}>
								<Button icon={<UploadOutlined />}>Upload</Button>
							</Upload>
						</Form.Item>

						<Form.Item label="Lien du teaser" className="mb-6" name="teaser_link">
							<Input />
						</Form.Item>

						<Divider />

						<Form.Item label="Publier le" className="mb-6" name="published_at">
							<DatePicker showTime />
						</Form.Item>

						<Form.Item label="Ouverture de l'édition" className="mb-6" name="open_at">
							<DatePicker />
						</Form.Item>

						<Form.Item label="Fermeture de l'édition" className="mb-6" name="close_at">
							<DatePicker />
						</Form.Item>

						<Divider />

						{/* Actions */}
						<div className="mt-8">
							<Button type="primary" htmlType="submit" className="mr-4" loading={STATUS_SAVING === status}>
								{STATUS_SAVING === status ? "Sauvegarde en cours..." : "Sauvegarder"}
							</Button>
							{edition.slug && (
								<Button icon={<GlobalOutlined />} href={`/editions/${edition.slug}`} target="_blank" rel="noreferrer">
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

export default EditionEditorPage;
