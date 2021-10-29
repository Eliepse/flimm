import EditorJS from "@editorjs/editorjs";
import HeaderTool from "@editorjs/header";
import EmbedTool from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "lib/useRouter";
import apiArticle from "lib/api/apiArticle";
import { getCsrfToken } from "lib/api/broker";
import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, DatePicker, Form, Input, message, Skeleton, Upload } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { normalizeOnUploadChanges } from "lib/support/forms";
import slug from "slug";

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
	const { query } = useRouter();
	const [article, setArticle] = useState();
	const [autoFilledSlug, setAutoFilledSlug] = useState(true);
	const [status, setStatus] = useState(STATUS_INIT);
	const editor = useRef();
	const [form] = Form.useForm();

	const isArticleLoaded = article !== undefined;

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
				setAutoFilledSlug(data.slug === slug(data.title));
				setArticle(data);
			})
			.catch(console.error)
			.finally(() => setStatus(STATUS_IDLE));
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.id]);

	// Update the editor when the article changes (save, reload, ...)
	useEffect(() => {
		if (!article) {
			return;
		}

		if (!editor.current) {
			//noinspection JSValidateTypes
			editor.current = new EditorJS({
				holder: "editorjs",
				placeholder: "Écrivez votre article ici...",
				autofocus: true,
				minHeight: 32,
				tools: {
					header: {
						class: HeaderTool,
						config: {
							levels: [2, 3, 4],
							defaultLevel: 2,
						},
					},
					embed: EmbedTool,
					image: {
						class: ImageTool,
						config: {
							endpoints: { byFile: `${location.protocol}//${location.host}/api/articles/${article.id}/media` },
							additionalRequestHeaders: { "X-XSRF-TOKEN": getCsrfToken() },
						},
					},
				},
				data: article?.content || {},
			});
		}

		return () => {
			if (typeof editor.current?.destroy === "function") {
				editor.current?.destroy();
			}
			editor.current = undefined;
		};
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isArticleLoaded]);

	/*
	| -------------------------------------------------
	| Event handlers
	| -------------------------------------------------
	*/


	/*
	| -------------------------------------------------
	| Actions
	| -------------------------------------------------
	 */

	function submitForm() {
		setStatus(STATUS_SAVING);

		// Get the editor value first
		editor.current
			.save()
			.then((data) => {
				apiArticle
					.update({ id: article.id, ...form.getFieldsValue(), content: data })
					.then((resData) => {
						setArticle(resData);
						//noinspection JSIgnoredPromiseFromCall
						message.success("Article mis à jour");
						form.setFieldsValue({ ...resData, thumbnail: normalizeThumbnailForInput(resData.thumbnail) });
					})
					.catch((e) => {
						//noinspection JSIgnoredPromiseFromCall
						message.error("Error while saving");
						console.error(e);
					})
					.finally(() => setStatus(STATUS_IDLE));
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
						<div id="editorjs" />
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
					</div>
				</div>
			</Form>
		</DashboardLayout>
	);
};

export default ArticleEditorPage;
