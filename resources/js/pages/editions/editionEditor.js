import DashboardLayout from "components/layouts/DashboardLayout";
import { normalizedUploadedFiles, parseDayjsToDate, parseToSingleFile } from "lib/support/forms";
import { Button, DatePicker, Divider, Form, Input, notification, Upload } from "antd";
import { FileImageTwoTone, UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "lib/useRouter";
import { useEffect, useState } from "react";
import slug from "slug";
import apiEdition from "lib/api/apiEdition";
import useFormDefaults from "lib/hooks/useFormDefaults";

const schema = Yup.object().shape({
	title: Yup.string().min(4).max(150).required().trim(),
	slug: Yup.string()
		.min(4, "Trop court")
		.matches(/[a-zA-Z0-9-]+/)
		.required(),
	open_at: Yup.date().nullable(),
	close_at: Yup.date().nullable(),
	published_at: Yup.date().nullable(),
	thumbnail: Yup.object().nullable(),
});

const defaultData = {
	title: "",
	slug: "",
	open_at: null,
	close_at: null,
	published_at: null,
};

const HELP_TEXTS = {
	title: "Le titre original du film",
	slug:
		"Text affiché dans le lien pour identifier l'article. Attention, si l'article " +
		"a déjà été publié, les visiteurs ne pourront plus retrouver l'article si cette valeur " +
		"change (le précédent lien ne sera plus valide).",
	thumbnail: "Glissez/déposez une image ou cliquez pour en sélectionner une.",
};

const EditionEditorPage = () => {
	const { query, ...router } = useRouter();
	const isNew = query.id === undefined;
	//const [films, setFilms] = useState([]);
	const [apiData, setApiData] = useState({});
	const [autoFilledSlug, setAutoFilledSlug] = useState(isNew);
	const [isLoading, setIsLoading] = useState(true);

	/*
	| -------------------------------------------------
	| Formik
	| -------------------------------------------------
	 */

	const formik = useFormik({
		initialValues: defaultData,
		validationSchema: schema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: handleFormikSubmit,
	});

	const { antForm, itemProps, uploadItemProps } = useFormDefaults(formik, defaultData, HELP_TEXTS);

	/*
	| -------------------------------------------------
	| Initialization
	| -------------------------------------------------
	 */

	useEffect(() => {
		//apiFilm.all().then(setFilms);

		if (isNew) {
			setIsLoading(false);
			return;
		}

		apiEdition
			.get(query.id)
			.then((data) => {
				setIsLoading(false);
				const cleanData = normalizedUploadedFiles(data, ["thumbnail", "program"]);
				antForm.setFieldsValue(cleanData);
				formik.setValues(cleanData);
				// Slug has to be manually changed if article already in database
				setAutoFilledSlug(false);
				setApiData(data);
			})
			.catch(console.error);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
	| -------------------------------------------------
	| Events handlers
	| -------------------------------------------------
	 */

	function handleFormikSubmit(fields) {
		setIsLoading(true);

		const request = isNew ? apiEdition.create(fields) : apiEdition.update({ id: query.id, ...fields });

		request
			.then((data) => {
				formik.setValues(data);

				// Redirect to the edition mode on success
				if (isNew) {
					notification.success({ message: "Édition créée" });
					router.pushAdmin(`/editions/${data.id}`);
				} else {
					notification.success({ message: "Édition mise à jour" });
				}
			})
			.catch((err) => {
				formik.setErrors(err.errors);
			})
			.finally(() => setIsLoading(false));
	}

	function handleFormChanged(changedValues) {
		if (autoFilledSlug && Object.prototype.hasOwnProperty.call(changedValues, "title")) {
			antForm.setFieldsValue({ slug: slug(changedValues.title) });
		} else if (Object.prototype.hasOwnProperty.call(changedValues, "slug")) {
			setAutoFilledSlug(false);
			antForm.setFieldsValue({ slug: slug(changedValues.slug, { trim: false }) });
		}

		Object.entries(parseDayjsToDate(changedValues)).forEach(([name, value]) => formik.setFieldValue(name, value));
	}

	function handleFormSubmit() {
		const fields = antForm.getFieldsValue();
		formik.setValues(parseToSingleFile(parseDayjsToDate(fields), ["thumbnail", "program"])).finally(formik.submitForm);
	}

	/*
	| -------------------------------------------------
	| Render
	| -------------------------------------------------
	 */

	return (
		<DashboardLayout>
			<Form layout="vertical" form={antForm} onValuesChange={handleFormChanged}>
				<div className="grid grid-cols-3">
					{/*
					| -------------------------------------------------
					| Main fields
					| -------------------------------------------------
					*/}
					<div className="col-span-2 px-4">
						<Form.Item valuePropName="fileList" {...uploadItemProps("thumbnail")}>
							<Upload.Dragger
								defaultFileList={apiData.thumbnail ? [{ url: apiData.thumbnail }] : []}
								accept=".jpg,.jpeg,.png,.gif"
								beforeUpload={() => false}
								listType="picture-card"
							>
								<p className="ant-upload-drag-icon">
									<FileImageTwoTone />
								</p>
								<p className="ant-upload-text">Visuel principal</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item label="Titre" className="mb-6" {...itemProps("title")}>
							<Input />
						</Form.Item>

						<Form.Item label="Slug" className="mb-6" {...itemProps("slug")}>
							<Input />
						</Form.Item>

						<Form.Item label="Présentation" className="mb-6" {...itemProps("presentation")}>
							<Input.TextArea />
						</Form.Item>

						<Divider className="mb-6" />
					</div>

					{/*
					| -------------------------------------------------
					| Secondary fields
					| -------------------------------------------------
					*/}
					<aside className="col-span-1">
						<div className="p-4 border-2 border-solid border-gray-300">
							<Form.Item label="Programme" valuePropName="fileList" {...uploadItemProps("program")}>
								<Upload
									defaultFileList={apiData.program ? [{ url: apiData.program }] : []}
									beforeUpload={() => false}
									listType="text"
								>
									<Button icon={<UploadOutlined />}>Upload</Button>
								</Upload>
							</Form.Item>

							<Form.Item label="Lien du teaser" className="mb-6" {...itemProps("teaser_link")}>
								<Input />
							</Form.Item>

							<Divider />

							<Form.Item label="Publier le" className="mb-6" {...itemProps("published_at")}>
								<DatePicker showTime />
							</Form.Item>

							<Form.Item label="Ouverture de l'édition" className="mb-6" {...itemProps("open_at")}>
								<DatePicker />
							</Form.Item>

							<Form.Item label="Fermeture de l'édition" className="mb-6" {...itemProps("close_at")}>
								<DatePicker />
							</Form.Item>

							<hr className="my-4 border-t-2 border-gray-300" />

							{/* Actions */}
							<div className="mt-8">
								<Button size="large" type="primary" block onClick={handleFormSubmit} loading={isLoading}>
									{isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
								</Button>
							</div>
						</div>
					</aside>
				</div>
			</Form>
		</DashboardLayout>
	);
};

export default EditionEditorPage;
