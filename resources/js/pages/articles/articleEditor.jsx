import { useEffect, useState } from "react";
import { useRouter } from "lib/useRouter";
import apiArticle from "lib/api/apiArticle";
import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, DatePicker, Divider, Form, Input, message, Popconfirm, Skeleton, Upload } from "antd";
import { DeleteOutlined, GlobalOutlined } from "@ant-design/icons";
import { normalizeOnUploadChanges } from "lib/support/forms";
import RichtextEditorInput from "components/inputs/RichtextEditorInput";
import slug from "slug";
import apiEdition from "lib/api/apiEdition.js";

const STATUS_INIT = "initializing";
const STATUS_IDLE = "idle";
const STATUS_SAVING = "saving";

function normalizeThumbnailForInput(thumbnail) {
	if (!thumbnail) {
		return [];
	}

	return [{ status: "done", thumbUrl: thumbnail, uid: thumbnail }];
}

const ArticleEditorPage = () => {
	const { query, ...router } = useRouter();
	const [article, setArticle] = useState();
	// Useless for now, but will be usefull when article creation
	// will look like edition one (no new model modal).
	const [autoFilledSlug, setAutoFilledSlug] = useState(true);
	const [status, setStatus] = useState(STATUS_INIT);
	const [form] = Form.useForm();

	/*
	| -------------------------------------------------
	| Initialization
	| -------------------------------------------------
	 */

	// Load the article on start
	useEffect(() => {
		apiArticle
			.get(query.id)
			.then((data) => {
				form.setFieldsValue({ ...data, thumbnail: normalizeThumbnailForInput(data.thumbnail) });
				setAutoFilledSlug(false);
				setArticle(data);
			})
			.catch(console.error)
			.finally(() => setStatus(STATUS_IDLE));
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.id]);

	/*
	| -------------------------------------------------
	| Event handlers
	| -------------------------------------------------
	*/

	function handleRichtextChange(data) {
		form.setFieldsValue({ content: data });
	}

	/*
	| -------------------------------------------------
	| Actions
	| -------------------------------------------------
	 */

	function submitForm() {
		setStatus(STATUS_SAVING);

		// Get the editor value first
		apiArticle
			.update({ id: article.id, content: form.getFieldValue("content"), ...form.getFieldsValue() })
			.then((data) => {
				form.setFieldsValue({ ...data, thumbnail: normalizeThumbnailForInput(data.thumbnail) });
				setArticle(data);
				//noinspection JSIgnoredPromiseFromCall
				message.success("Article mis à jour");
			})
			.catch((e) => {
				console.error(e);
				//noinspection JSIgnoredPromiseFromCall
				message.error("Error while saving");
			})
			.finally(() => setStatus(STATUS_IDLE));
	}

	function deleteArticle() {
		if (!article.id) {
			return;
		}

		apiArticle
			.delete(article)
			.then(() => {
				router.pushAdmin("/articles");
				message.success("L'article a été supprimé");
			})
			.catch((e) => {
				console.error(e);
				message.error("Impossible de supprimer l'article");
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
			<Form form={form} initialValues={article} onFinish={submitForm} layout="vertical" className="grid grid-cols-3">
				{/*
				| -------------------------------------------------
				| Content editor
				| -------------------------------------------------
				*/}
				<div className="col-span-2 px-4">
					<Form.Item label="Titre" name="title" getValueFromEvent={titleMiddleware} rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Slug" name="slug" getValueFromEvent={slugMiddleware} rules={[{ required: true }]}>
						<Input addonBefore={`${location.origin}/actus/`} pattern="[0-9a-zA-Z-]+" />
					</Form.Item>

					<div className="relative py-4 mt-6 border-2 border-solid border-gray-300">
						<RichtextEditorInput
							value={article.content}
							onChange={handleRichtextChange}
							imageEndpoint={`${location.protocol}//${location.host}/api/articles/${article.id}/media`}
							loading={STATUS_INIT === status}
						/>
					</div>
				</div>
				{/*
				| -------------------------------------------------
				| Other fields (title, metadata, ...)
				| -------------------------------------------------
				*/}
				<div className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">
						<Form.Item label="Chapô" name="excerpt">
							<Input.TextArea />
						</Form.Item>

						<Form.Item label="Date de publication" name="published_at">
							<DatePicker showTime />
						</Form.Item>

						<Form.Item
							label="Thumbnail"
							name="thumbnail"
							extra="Image d'en-tête"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							rules={[{ required: true }]}
						>
							<Upload maxCount={1} beforeUpload={() => false} accept=".jpg,.jpeg,.png,.gif" listType="picture">
								<Button>Upload</Button>
							</Upload>
						</Form.Item>

						<hr className="my-4 border-t-2 border-gray-300" />

						{/* Actions */}
						<div className="mt-8">
							<Button type="primary" htmlType="submit" loading={STATUS_SAVING === status} className="mr-2">
								{STATUS_SAVING === status ? "Sauvegarde en cours..." : "Sauvegarder"}
							</Button>
							<Button
								type="link"
								icon={<GlobalOutlined />}
								href={`/actus/${article.slug}`}
								target="_blank"
								rel="noreferrer"
							>
								Voir l&apos;article
							</Button>
						</div>
						{Boolean(article.id) && (
							<div>
								<Divider />
								<Popconfirm title="Êtes-vous sûr de vouloir supprimer ?" onConfirm={deleteArticle}>
									<Button icon={<DeleteOutlined />}>
										Supprimer l'article
									</Button>
								</Popconfirm>
							</div>
						)}
					</div>
				</div>
			</Form>
		</DashboardLayout>
	);
};

export default ArticleEditorPage;
