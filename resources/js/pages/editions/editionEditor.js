import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, DatePicker, Divider, Form, Input, message, Skeleton, Upload } from "antd";
import { FileImageTwoTone, GlobalOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "lib/useRouter";
import { useEffect, useMemo, useState } from "react";
import apiEdition from "lib/api/apiEdition";
import HeaderTool from "@editorjs/header";
import EmbedTool from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import { normalizeOnUploadChanges } from "lib/support/forms";
import slug from "slug";
import { getCsrfToken } from "lib/api/broker";
import EditorJs from "react-editor-js";

const TOOLS = {
	header: {
		class: HeaderTool,
		config: {
			levels: [2, 3, 4],
			defaultLevel: 2,
		},
	},
	embed: EmbedTool,
};

const EditionEditorPage = () => {
	const { query, ...router } = useRouter();
	const isNew = query.id === undefined;
	const [edition, setEdition] = useState({});
	const [autoFilledSlug, setAutoFilledSlug] = useState(isNew);
	const [isLoading, setIsLoading] = useState(true);
	const [form] = Form.useForm();
	//
	const editor = useMemo(() => {
		// Do not render the editor on the creation state
		// because no model is available to store imported images
		if (!query.id) {
			return <p>Vous devez d&apos;abord enregistrer l&apos;édition avant de pouvoir éditer le contenu.</p>;
		}

		// Do not render the editor until the data is ready
		if (edition.presentation === undefined) {
			return <Skeleton active />;
		}

		return (
			<AntEditorJS
				imageToolEndpoint={`${location.protocol}//${location.host}/api/editions/${query.id}/media`}
				value={edition.presentation}
			/>
		);
	}, [edition.presentation, query.id]);

	/*
	| -------------------------------------------------
	| Formik
	| -------------------------------------------------
	 */

	//const { antForm, itemProps, uploadItemProps, editorJSProps } = useFormDefaults(formik, defaultData, HELP_TEXTS);
	//const richEditorProps = useMemo(() => editorJSProps("presentation"), []);
	//const richEditorProps = null;

	/*
	| -------------------------------------------------
	| Initialization
	| -------------------------------------------------
	 */

	useEffect(() => {
		if (isNew) {
			setIsLoading(false);
			return;
		}

		apiEdition
			.get(query.id)
			.then((data) => {
				form.setFieldsValue({
					...data,
					thumbnail: data.thumbnail ? [data.thumbnail] : [],
					program: data.program ? [data.program] : [],
					poster: data.poster ? [data.poster] : [],
					brochure: data.brochure ? [data.brochure] : [],
					flyer: data.flyer ? [data.flyer] : [],
				});

				// Slug has to be manually changed if article already in database
				setAutoFilledSlug(false);
				setEdition(data);
			})
			.catch(console.error)
			.finally(() => setIsLoading(false));
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
	| -------------------------------------------------
	| Events handlers
	| -------------------------------------------------
	 */

	function handleSubmit(values) {
		setIsLoading(true);

		const request = isNew ? apiEdition.create(values) : apiEdition.update({ id: query.id, ...values });

		request
			.then((data) => {
				// Redirect to the edition mode on success
				if (isNew) {
					message.success("Édition créée");
					router.pushAdmin(`/editions/${data.id}`);
				} else {
					message.success("Édition mise à jour");
					setIsLoading(false);
				}
			})
			.catch(console.error);
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

					<Form.Item label="Présentation" className="mb-6" name="presentation">
						{editor}
					</Form.Item>
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
							<Button type="primary" htmlType="submit" loading={isLoading}>
								{isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
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

const AntEditorJS = ({ value, onChange, imageToolEndpoint, ...rest }) => {
	const tools = {
		...TOOLS,
		image: {
			class: ImageTool,
			config: {
				endpoints: { byFile: imageToolEndpoint },
				additionalRequestHeaders: {
					" X-XSRF-TOKEN": getCsrfToken(),
				},
			},
		},
	};

	function handleChange(editor, data) {
		onChange(data);
	}

	return <EditorJs data={value || {}} tools={tools} onChange={handleChange} {...rest} />;
};

export default EditionEditorPage;
