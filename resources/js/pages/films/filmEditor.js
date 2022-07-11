import { useEffect, useState } from "react";
import apiFilm from "lib/api/apiFilm";
import { useRouter } from "lib/useRouter";
import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, Form, Input, message, Upload } from "antd";
import { GlobalOutlined, UploadOutlined } from "@ant-design/icons";
import { normalizeOnUploadChanges } from "lib/support/forms";
import slug from "slug";

function normalizeThumbnailForInput(thumbnail) {
	if (!thumbnail) {
		return [];
	}

	return [{ status: "done", thumbUrl: thumbnail, uid: thumbnail, name: "Thumbnail" }];
}

const FilmEditorPage = () => {
	const { query, ...router } = useRouter();
	const isNew = query.id === undefined;
	const [isLoading, setIsLoading] = useState(true);
	const [autoFilledSlug, setAutoFilledSlug] = useState(isNew);
	const [film, setFilm] = useState({});
	const [form] = Form.useForm();

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

		apiFilm
			.get(query.id)
			.then(({ data }) => {
				setAutoFilledSlug(false);
				form.setFieldsValue({
					...data,
					thumbnail: normalizeThumbnailForInput(data.thumbnail),
				});
				setFilm(data);
			})
			.catch(console.error)
			.finally(() => setIsLoading(false));
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
	| -------------------------------------------------
	| Submit
	| -------------------------------------------------
	 */

	function handleSubmit(values) {
		setIsLoading(true);

		// Store new article
		if (isNew) {
			apiFilm
				.create(values)
				.then(({ data }) => {
					//noinspection JSIgnoredPromiseFromCall
					message.success("Film créé");

					// Redirect to the edition mode on success
					router.pushAdmin(`/films/${data.id}`);
				})
				.catch((e) => {
					console.error(e);
					setIsLoading(false);
				});
			return;
		}

		apiFilm
			.update({ id: query.id, ...values })
			.then(({ data }) => {
				setFilm(data);

				form.setFieldsValue({
					...data,
					thumbnail: normalizeThumbnailForInput(data.thumbnail),
				});

				// Slug has to be manually changed if already in database
				setAutoFilledSlug(false);

				//noinspection JSIgnoredPromiseFromCall
				message.success("Film mis à jour");
			})
			.catch(console.error)
			.finally(() => {
				setAutoFilledSlug(false);
				setIsLoading(false);
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

	return (
		<DashboardLayout>
			<Form form={form} initialValues={film} onFinish={handleSubmit} layout="vertical" className="grid grid-cols-3">
				<div className="col-span-2 px-4">
					{/*
				| -------------------------------------------------
				| Content editor
				| -------------------------------------------------
				*/}
					<Form.Item
						label="Titre"
						name="title"
						extra="Le titre original du film"
						getValueFromEvent={titleMiddleware}
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label="Slug" name="slug" getValueFromEvent={slugMiddleware} rules={[{ required: true }]}>
						<Input addonBefore={`${location.origin}/films/`} pattern="[0-9a-zA-Z-]+" />
					</Form.Item>

					<Form.Item label="Titre de remplacement" name="title_override" extra="Par exemple, une traduction">
						<Input />
					</Form.Item>

					<Form.Item label="Synopsis" name="synopsis">
						<Input.TextArea maxLength={1000} showCount />
					</Form.Item>

					<Form.Item label="Accroche" name="description" extra="Accroche courte par le FLiMM">
						<Input.TextArea maxLength={1000} showCount />
					</Form.Item>

					<Form.Item label="Autres informations techniques" name="other_technical_infos">
						<Input.TextArea maxLength={1000} showCount />
					</Form.Item>

					<Form.Item label="Siteweb" name="website_link">
						<Input type="url" />
					</Form.Item>

					<Form.Item label="Lien du trailer" name="trailer_link">
						<Input type="url" />
					</Form.Item>

					<Form.Item label="Lien du film" name="video_link">
						<Input type="url" />
					</Form.Item>

					<Form.Item label="Référence IMDB" name="imdb_id">
						<Input />
					</Form.Item>
				</div>
				{/*
				| -------------------------------------------------
				| Other fields (title, metadata, ...)
				| -------------------------------------------------
				*/}
				<aside className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">
						<Form.Item label="Durée du film" name="duration" rules={[{ required: true }]}>
							<Input min={0} pattern="[0-9]+" addonAfter="min" />
						</Form.Item>

						<Form.Item label="Année de sortie" name="year" rules={[{ required: true }]}>
							<Input min={0} pattern="[0-9]{4}" />
						</Form.Item>

						<Form.Item label="Réalisateur" name="filmmaker" rules={[{ required: true }]}>
							<Input />
						</Form.Item>

						<Form.Item label="Genre du film" name="gender">
							<Input />
						</Form.Item>

						<Form.Item label="Production" name="production_name">
							<Input />
						</Form.Item>

						<Form.Item label="Pays" name="country">
							<Input />
						</Form.Item>

						<Form.Item
							label="Visuel principal"
							name="thumbnail"
							valuePropName="fileList"
							getValueFromEvent={normalizeOnUploadChanges}
							rules={[{ required: true }]}
						>
							<Upload maxCount={1} beforeUpload={() => false} listType="picture">
								<Button icon={<UploadOutlined />}>Upload</Button>
							</Upload>
						</Form.Item>

						<hr className="my-4 border-t-2 border-gray-300" />

						{/* Actions */}
						<div className="mt-8 flex items-center">
							<Button type="primary" htmlType="submit" loading={isLoading}>
								{isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
							</Button>
							{film.slug && (
								<Button href={`/films/${film.slug}`} rel="noreferrer" type="link" icon={<GlobalOutlined />}>
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

export default FilmEditorPage;
