import DashboardLayout from "components/layouts/DashboardLayout";
import { Button } from "hds-react";
import { formikItemProps, normalizedUploadedFiles, parseDayjsToDate, parseToSingleFile } from "lib/support/forms";
import { DatePicker, Divider, Form, Input, Upload } from "antd";
import { FileImageTwoTone } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "lib/useRouter";
import { useEffect, useState } from "react";
import slug from "slug";
import apiEdition from "lib/api/apiEdition";
import apiFilm from "lib/api/apiFilm";
import FilmSchedulesInput from "components/FilmSchedulesInput";

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
	const [form] = Form.useForm();
	const isNew = query.id === undefined;
	const [films, setFilms] = useState([]);
	const [apiData, setApiData] = useState({});
	const [customSlug, setCustomSlug] = useState(false);
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

	/*
	| -------------------------------------------------
	| Initialization
	| -------------------------------------------------
	 */

	useEffect(() => {
		apiFilm.all().then(setFilms);

		if (isNew) {
			setIsLoading(false);
			return;
		}

		apiEdition
			.get(query.id)
			.then((data) => {
				setIsLoading(false);
				const cleanData = normalizedUploadedFiles(data, ["thumbnail"]);
				form.setFieldsValue(cleanData);
				formik.setValues(cleanData);
				setCustomSlug(slug(cleanData.title) !== cleanData.slug);
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
					router.pushAdmin(`/editions/${data.id}`);
				}
			})
			.catch((err) => {
				formik.setErrors(err.errors);
			})
			.finally(() => setIsLoading(false));
	}

	function handleFormChanged(changedValues) {
		if (!customSlug && Object.prototype.hasOwnProperty.call(changedValues, "title")) {
			form.setFieldsValue({ slug: slug(changedValues.title) });
		} else if (Object.prototype.hasOwnProperty.call(changedValues, "slug")) {
			setCustomSlug(true);
			form.setFieldsValue({ slug: slug(changedValues.slug, { trim: false }) });
		}

		Object.entries(parseDayjsToDate(changedValues)).forEach(([name, value]) => formik.setFieldValue(name, value));
	}

	function handleUploadChanged(e) {
		return Array.isArray(e) ? e : e && e.fileList;
	}

	function handleFormSubmit() {
		const fields = form.getFieldsValue();
		formik.setValues(parseToSingleFile(parseDayjsToDate(fields), ["thumbnail"]));
		formik.submitForm();
	}

	/*
	| -------------------------------------------------
	| Render
	| -------------------------------------------------
	 */

	return (
		<DashboardLayout>
			<Form layout="vertical" form={form} onValuesChange={handleFormChanged}>
				<div className="grid grid-cols-3">
					{/*
					| -------------------------------------------------
					| Main fields
					| -------------------------------------------------
					*/}
					<div className="col-span-2 px-4">
						<Form.Item
							valuePropName="fileList"
							getValueFromEvent={handleUploadChanged}
							{...formikItemProps(formik, "thumbnail", HELP_TEXTS)}
						>
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

						<Form.Item label="Titre" className="mb-6" {...formikItemProps(formik, "title", HELP_TEXTS)}>
							<Input />
						</Form.Item>

						<Form.Item label="Slug" className="mb-6" {...formikItemProps(formik, "slug", HELP_TEXTS)}>
							<Input />
						</Form.Item>

						<Form.Item label="Présentation" className="mb-6" {...formikItemProps(formik, "presentation", HELP_TEXTS)}>
							<Input.TextArea />
						</Form.Item>

						<Divider className="mb-6" />

						{/*
						Here, instead of a basic film list, a list of film schedules!
						A single button to add a film (through a modal), then all the schedules
						are ordered by datetime, and grouped by day. :)
						*/}
						<Form.Item label="Scéances" className="mb-6" {...formikItemProps(formik, "schedules", HELP_TEXTS)}>
							<FilmSchedulesInput
								films={films}
								open_at={form.getFieldValue("open_at")}
								close_at={form.getFieldValue("close_at")}
							/>
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
								label="Rendre publique le"
								className="mb-6"
								{...formikItemProps(formik, "published_at", HELP_TEXTS)}
							>
								<DatePicker showTime />
							</Form.Item>

							<Form.Item
								label="Ouverture de l'édition"
								className="mb-6"
								{...formikItemProps(formik, "open_at", HELP_TEXTS)}
							>
								<DatePicker />
							</Form.Item>

							<Form.Item
								label="Fermeture de l'édition"
								className="mb-6"
								{...formikItemProps(formik, "close_at", HELP_TEXTS)}
							>
								<DatePicker />
							</Form.Item>

							<hr className="my-4 border-t-2 border-gray-300" />

							{/* Actions */}
							<div className="mt-8">
								<Button onClick={handleFormSubmit} isLoading={isLoading} loadingText="Sauvegarde en cours...">
									Sauvegarder
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
