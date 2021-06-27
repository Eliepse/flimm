import DashboardLayout from '../../components/layouts/DashboardLayout';
import {Button, DateInput, TextInput} from 'hds-react';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from '../../lib/useRouter';
import apiArticle from '../../lib/api/apiArticle';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import EditorJS from '@editorjs/editorjs';
import EditorJSHeader from "@editorjs/header";
import dayjs from 'dayjs';

const newArticleSchema = Yup.object().shape({
	title: Yup.string().min(5).max(100).required().trim(),
	slug: Yup.string().min(5, "Trop court").required(),
	content: Yup.object().nullable(),
	published_at: Yup.date().nullable(),
});

export default function ArticleEditorPage() {
	const {query} = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [article, setArticle] = useState();
	const editor = useRef();
	const formik = useFormik({
		initialValues: {title: "", slug: "", content: null, published_at: null},
		validationSchema: newArticleSchema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: (data) => {
			apiArticle.update({id: article.id, ...data})
				.then((data) => {
					setArticle(data);
					setIsLoading(false);
				})
				.catch(console.error);
		},
	});

	useEffect(() => {
		apiArticle.get(query.id)
			.then((data) => {
				setArticle(data);
				formik.setValues({
					title: data.title,
					slug: data.slug,
					published_at: data.published_at,
				});
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		if(!article) {
			return;
		}

		//noinspection JSValidateTypes
		editor.current = new EditorJS({
			holder: "editorjs",
			placeholder: 'Écrivez votre article ici...',
			autofocus: true,
			minHeight: 32,
			data: article?.content || {},
		});

		return () => {
			editor.current?.destroy();
		};
	}, [article]);

	/** @param {String} value */
	function handeDateChange(value) {
		if (value.trim().length === 0) {
			formik.setFieldValue("published_at", null);
			return;
		}

		const [day, month, year] = value.split(".");
		formik.setFieldValue("published_at", new Date(Number(year), Number(month), Number(day)));
	}

	function submitForm() {
		setIsLoading(true);
		editor.current.save()
			.then((data) => {
				formik.setFieldValue("content", data);
				formik.submitForm();
			}).catch(console.error);
	}

	return (
		<DashboardLayout>
			<div className="grid grid-cols-3">
				<form className="col-span-2 p-4">
					<h2 className="text-xl font-bold">Contenu</h2>
					<p className="text-gray-400">
						Ce block représente le contenu de l'article. Vous pouvez y écrire ce que vous souhaitez, ajouter des images
						et autres médias. Le style affiché dans cet éditeur est proche du rendu final.
					</p>
					<div id="editorjs" className="relative py-4 mt-6 border-2 border-solid border-gray-800"/>
				</form>
				<aside className="p-4 border-2 border-solid border-gray-200">
					<TextInput
						type="text"
						id="title"
						name="title"
						label="Titre"
						className="mb-6"
						required
						onChange={formik.handleChange}
						value={formik.values.title}
						errorText={formik.errors.title}
						invalid={formik.errors.title}
					/>

					<TextInput
						type="text"
						id="slug"
						name="slug"
						label="Slug"
						helperText="Text affiché dans le lien pour identifier l'article. Attention, si l'article
						a déjà été publié, les visiteurs ne pourront plus retrouver l'article si cette valeur
						change (le précédent lien ne sera plus valide)."
						className="mb-6"
						required
						onChange={formik.handleChange}
						value={formik.values.slug}
						errorText={formik.errors.slug}
						invalid={formik.errors.slug}
					/>

					<DateInput
						type="text"
						id="published_at"
						name="published_at"
						label="Date de publication"
						className="mb-6"
						required
						onChange={handeDateChange}
						value={formik.values.published_at ? dayjs(formik.values.published_at).format("D.M.YYYY") : null}
						errorText={formik.errors.published_at}
						invalid={formik.errors.published_at}
					/>

					<div className="mt-8">
						<Button onClick={submitForm} isLoading={isLoading} loadingText="Sauvegarde en cours...">Sauvegarder</Button>
					</div>
				</aside>
			</div>
		</DashboardLayout>
	);
}