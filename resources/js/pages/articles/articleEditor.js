import DashboardLayout from '../../components/layouts/DashboardLayout';
import {Button, IconLinkExternal, TextArea, TextInput} from 'hds-react';
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

const articleSchema = Yup.object().shape({
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

	// Load the article on start
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

	/*
	| -------------------------------------------------
	| Formik
	| -------------------------------------------------
	 */

	const formik = useFormik({
		initialValues: {title: "", slug: "", excerpt: null, content: null, published_at: null, thumbnail: undefined},
		validationSchema: articleSchema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: (data) => {
			apiArticle.update({id: article.id, ...data})
				.then((data) => {
					setArticle(data);
					formik.setValues({
						title: data.title,
						slug: data.slug,
						excerpt: data.excerpt,
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

	/*
	| -------------------------------------------------
	| Event handlers
	| -------------------------------------------------
	 */

	// Update the editor when the article changes (save, reload, ...)
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

	/*
	| -------------------------------------------------
	| Actions
	| -------------------------------------------------
	 */

	function submitForm() {
		setIsLoading(true);
		editor.current.save()
			.then((data) => {
				formik.setFieldValue("content", data);
				formik.submitForm();
			}).catch(console.error);
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
					<div className="p-4 pb-6 border-2 border-solid border-gray-300">
						<h2 className="text-xl font-bold">Contenu</h2>
						<p className="text-gray-500">
							Le bloc ci-dessous représente le contenu de l'article. Vous pouvez y écrire ce que vous souhaitez,
							ajouter des images et autres médias. Le style affiché dans cet éditeur est proche du rendu final.
						</p>
					</div>
					<div ref={editorWrapperRef} className="relative py-4 mt-6 border-2 border-solid border-gray-300">
						<div id="editorjs"/>
					</div>
					{formik.errors.content && formik.errors.content.map((msg) => <p className="my-2 text-red-500">{msg}</p>)}
				</div>

				{/*
				| -------------------------------------------------
				| Other fields (title, metadata, ...)
				| -------------------------------------------------
				*/}
				<aside className="col-span-1">
					<div className="p-4 border-2 border-solid border-gray-300">

						{/* See article link */}
						<div className="text-right">
							{Boolean(article?.slug) && (
								<a href={`/actus/${article.slug}`} target="_blank" className="inline-flex items-center">
									Voir l'article
									<IconLinkExternal className="ml-2"/>
								</a>
							)}
						</div>

						<hr className="my-4 border-t-2 border-gray-300"/>

						{/* Inputs */}
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

						<TextArea
							id="excerpt"
							name="excerpt"
							label="Chapô"
							className="mb-6"
							onChange={formik.handleChange}
							value={formik.values.excerpt}
							errorText={formik.errors.excerpt}
							invalid={formik.errors.excerpt}
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

						{/* Actions */}
						<div className="mt-8">
							<Button onClick={submitForm} isLoading={isLoading} loadingText="Sauvegarde en cours...">Sauvegarder</Button>
						</div>
					</div>
				</aside>
			</div>
		</DashboardLayout>
	);
}