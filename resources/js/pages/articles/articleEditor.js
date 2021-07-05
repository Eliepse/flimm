import DashboardLayout from '../../components/layouts/DashboardLayout';
import {Button, DateInput, TextInput} from 'hds-react';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from '../../lib/useRouter';
import apiArticle from '../../lib/api/apiArticle';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import EditorJS from '@editorjs/editorjs';
import HeaderTool from "@editorjs/header";
import EmbedTool from "@editorjs/embed";
import ImageTool from '@editorjs/image';
import {getCsrfToken} from '../../lib/api/broker';
import FileInput from '../../components/FileInput/FileInput';
import DateTimeInput from '../../components/DateTimeInput/DateTimeInput';
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
	const editorWrapperRef = useRef();
	const editor = useRef();
	const formik = useFormik({
		initialValues: {title: "", slug: "", content: null, published_at: null, thumbnail: undefined},
		validationSchema: newArticleSchema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: (data) => {
			apiArticle.update({id: article.id, ...data})
				.then((data) => {
					setArticle(data);
					formik.setValues({
						title: data.title,
						slug: data.slug,
						published_at: data.published_at ? dayjs(data.published_at).toDate() : undefined,
						content: data.content,
						thumbnail: data.thumbnail,
					});
					setIsLoading(false);
				})
				.catch((err) => {
					formik.setErrors(err.errors);
					setIsLoading(false);
				});
		},
	});

	useEffect(() => {
		apiArticle.get(query.id)
			.then((data) => {
				setArticle(data);
				formik.setValues({
					title: data.title,
					slug: data.slug,
					published_at: data.published_at ? dayjs(data.published_at).toDate() : undefined,
					content: data.content,
					thumbnail: data.thumbnail,
				});
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		if (!article) {
			return;
		}

		if (!editor.current) {
			//noinspection JSValidateTypes
			editor.current = new EditorJS({
				holder: "editorjs",
				placeholder: 'Écrivez votre article ici...',
				autofocus: true,
				minHeight: 32,
				tools: {
					header: HeaderTool,
					embed: EmbedTool,
					image: {
						class: ImageTool,
						config: {
							endpoints: {
								byFile: `${location.protocol}//${location.host}/api/articles/${article.id}/media`,
							},
							additionalRequestHeaders: {
								"X-XSRF-TOKEN": getCsrfToken(),
							},
						},
					},
				},
				data: article?.content || {},
			});
		}

		return () => {
			if (typeof editor.current.destroy === "function") {
				editor.current?.destroy();
			}
			if (!editorWrapperRef.current.querySelector("#editorjs")) {
				const newEditorDiv = document.createElement("div");
				newEditorDiv.id = "editorjs";
				editorWrapperRef.current.append(newEditorDiv);
			}
			editor.current = undefined;
		};
	}, [article]);

	/** @param {InputEvent} event */
	function handleFileChange(event) {
		formik.setFieldValue("thumbnail", event.target.files[0]);
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
				<div className="col-span-2 p-4">
					<h2 className="text-xl font-bold">Contenu</h2>
					<p className="text-gray-400">
						Ce block représente le contenu de l'article. Vous pouvez y écrire ce que vous souhaitez, ajouter des images
						et autres médias. Le style affiché dans cet éditeur est proche du rendu final.
					</p>
					<div ref={editorWrapperRef} className="relative py-4 mt-6 border-2 border-solid border-gray-800">
						<div id="editorjs"/>
					</div>
					{formik.errors.content && formik.errors.content.map((msg) => <p className="my-2 text-red-500">{msg}</p>)}
				</div>
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

					<DateTimeInput
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

					<FileInput
						id="thumbnail"
						name="thumbnail"
						label="Thumbnail"
						helperText="Image d'en-tête"
						value={formik.values.thumbnail}
						errorText={formik.errors.thumbnail}
						invalid={formik.errors.thumbnail}
						onChange={handleFileChange}
						required
					/>


					<div className="mt-8">
						<Button onClick={submitForm} isLoading={isLoading} loadingText="Sauvegarde en cours...">Sauvegarder</Button>
					</div>
				</aside>
			</div>
		</DashboardLayout>
	);
}