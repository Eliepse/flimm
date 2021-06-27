import DashboardLayout from '../../components/layouts/DashboardLayout';
import {DateInput, TextInput} from 'hds-react';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from '../../lib/useRouter';
import apiArticle from '../../lib/api/apiArticle';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import EditorJS from '@editorjs/editorjs';

const newArticleSchema = Yup.object().shape({
	title: Yup.string().min(5).max(100).required().trim(),
	slug: Yup.string().min(5, "Trop court").required(),
});

export default function ArticleEditorPage() {
	const {query} = useRouter();
	const [article, setArticle] = useState();
	const editor = useRef();
	const formik = useFormik({
		initialValues: {title: "", slug: "", published_at: null},
		validationSchema: newArticleSchema,
		validateOnChange: false,
		onSubmit: ({title, slug}) => {
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

		editor.current = new EditorJS({
			holder: "editorjs",
			autofocus: true,
			data: {},
			minHeight: 32,
		});

		return () => {
			editor.current.destroy();
		};
	}, []);

	useEffect(() => {
		if (!article?.content) {
			return;
		}

		editor.current.data = article.content || {};
	}, [article]);

	return (
		<DashboardLayout>
			<div className="grid grid-cols-3">
				<form className="col-span-2 p-4">
					<h2 className="text-xl font-bold">Contenu</h2>
					<p className="text-gray-400">
						Ce block représente le contenu de l'article. Vous pouvez y écrire ce que vous souhaitez, ajouter des images
						et autres médias. Le style affiché dans cet éditeur est proche du rendu final.
					</p>
					<div id="editorjs" className="py-4 mt-6 border-2 border-solid border-gray-800"/>
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
						onChange={formik.handleChange}
						value={formik.values.published_at}
						errorText={formik.errors.published_at}
						invalid={formik.errors.published_at}
					/>
				</aside>
			</div>
		</DashboardLayout>
	);
}