import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import apiFilm from "lib/api/apiFilm";
import { useRouter } from "lib/useRouter";
import DashboardLayout from "components/layouts/DashboardLayout";
import { Button, NumberInput, TextArea, TextInput } from "hds-react";
import { formikProps } from "lib/support/forms";
import FileInput from "components/FileInput/FileInput";
import { notification } from "antd";

const filmSchema = Yup.object().shape({
	title: Yup.string().min(1).max(150).required().trim(),
	title_override: Yup.string().nullable(),
	duration: Yup.number().integer().min(1).required(),
	synopsis: Yup.string().nullable(),
	description: Yup.string().nullable(),
	filmmaker: Yup.string().required(),
	technical_members: Yup.string().nullable(),
	gender: Yup.string().nullable(),
	year: Yup.string()
		.matches(/[0-9]{4}/)
		.required(),
	production_name: Yup.string().nullable(),
	country: Yup.string().nullable(),
	other_technical_infos: Yup.string().nullable(),
	website_link: Yup.string().url().nullable(),
	video_link: Yup.string().url().nullable(),
	trailer_link: Yup.string().url().nullable(),
	imdb_id: Yup.string().nullable(),
});

const defaultData = {
	title: "",
	title_override: "",
	duration: 0,
	synopsis: "",
	description: "",
	filmmaker: "",
	technical_members: "",
	gender: "",
	year: "",
	production_name: "",
	country: "",
	other_technical_infos: "",
	website_link: "",
	video_link: "",
	trailer_link: "",
	imdb_id: "",
	thumbnail: "",
};

const FilmEditorPage = () => {
	const { query, ...router } = useRouter();
	const isNew = query.id === undefined;
	const [isLoading, setIsLoading] = useState(true);

	/*
	| -------------------------------------------------
	| Formik
	| -------------------------------------------------
	 */

	const formik = useFormik({
		initialValues: defaultData,
		validationSchema: filmSchema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: (formikData) => {
			setIsLoading(true);

			// Store new article
			if (isNew) {
				apiFilm
					.create(formikData)
					.then((res) => {
						formik.setValues(res);
						notification.success({ message: "Film créé" });
						// Redirect to the edition mode on success
						router.pushAdmin(`/films/${res.id}`);
					})
					.catch(console.error)
					.finally(() => setIsLoading(false));
				return;
			}

			apiFilm
				.update({ id: query.id, ...formikData })
				.then((res) => {
					formik.setValues(res);
					notification.success({ message: "Film mis à jour" });
				})
				.catch(console.error)
				.finally(() => setIsLoading(false));
		},
	});

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
			.then((data) => {
				setIsLoading(false);
				formik.setValues(data);
			})
			.catch(console.error);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
	| -------------------------------------------------
	| Events handlers
	| -------------------------------------------------
	 */

	/** @param {InputEvent} event */
	function handleFileChange(event) {
		formik.setFieldValue("thumbnail", event.target.files[0]);
	}

	/*
	| -------------------------------------------------
	| Render
	| -------------------------------------------------
	 */

	return (
		<DashboardLayout>
			<div className="grid grid-cols-3">
				{/*
				| -------------------------------------------------
				| Content editor
				| -------------------------------------------------
				*/}
				<div className="col-span-2 px-4">
					{/* Inputs */}
					<TextInput
						type="text"
						label="Titre"
						helperText="Le titre original du film"
						className="mb-6"
						required
						{...formikProps(formik, "title")}
					/>

					<TextInput
						type="text"
						label="Titre de remplacement"
						helperText="Par exemple, une traduction"
						className="mb-6"
						{...formikProps(formik, "title_override")}
					/>

					<TextArea label="Synopsis" className="mb-6" {...formikProps(formik, "synopsis")} />

					<TextArea
						label="Description"
						helperText="Description additionelle du FLiMM"
						className="mb-6"
						{...formikProps(formik, "description")}
					/>

					<TextInput
						type="text"
						label="Autres informations techniques"
						className="mb-6"
						{...formikProps(formik, "other_technical_infos")}
					/>

					<TextInput type="text" label="Siteweb" className="mb-6" {...formikProps(formik, "website_link")} />

					<TextInput type="text" label="Lien du trailer" className="mb-6" {...formikProps(formik, "trailer_link")} />

					<TextInput type="text" label="Lien du film" className="mb-6" {...formikProps(formik, "video_link")} />

					<TextInput type="text" label="Référence IMDB" className="mb-6" {...formikProps(formik, "imdb_id")} />
				</div>

				{/*
				| -------------------------------------------------
				| Other fields (title, metadata, ...)
				| -------------------------------------------------
				*/}
				<aside className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">
						<NumberInput label="Durée du film" className="mb-6" {...formikProps(formik, "duration")} required />

						<TextInput type="text" label="Année de sortie" className="mb-6" {...formikProps(formik, "year")} />

						<TextInput type="text" label="Réalisateur" className="mb-6" {...formikProps(formik, "filmmaker")} />

						<TextInput type="text" label="Genre du film" className="mb-6" {...formikProps(formik, "gender")} />

						<TextInput type="text" label="Production" className="mb-6" {...formikProps(formik, "production_name")} />

						<TextInput type="text" label="Pays" className="mb-6" {...formikProps(formik, "country")} />

						<FileInput
							id="thumbnail"
							name="thumbnail"
							label="Visuel principal"
							value={formik.values.thumbnail}
							errorText={formik.errors.thumbnail}
							invalid={formik.errors.thumbnail}
							onChange={handleFileChange}
							required
						/>

						<hr className="my-4 border-t-2 border-gray-300" />

						{/* Actions */}
						<div className="mt-8">
							<Button onClick={formik.submitForm} isLoading={isLoading} loadingText="Sauvegarde en cours...">
								Sauvegarder
							</Button>
						</div>
					</div>
				</aside>
			</div>
		</DashboardLayout>
	);
};

export default FilmEditorPage;
