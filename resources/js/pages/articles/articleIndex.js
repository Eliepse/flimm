import DashboardLayout from '../../components/layouts/DashboardLayout';
import {useEffect, useState} from 'react';
import apiArticle from '../../lib/api/apiArticle';
import {Button, Card, Dialog, IconDocument, TextInput} from 'hds-react';
import {useRouter} from '../../lib/useRouter';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import slug from 'slug';
import {Link} from '../../app';

const newArticleSchema = Yup.object().shape({
	title: Yup.string().min(3).max(250).required(),
	slug: Yup.string().min(3, "Trop court").max(64).required(),
});

export default function ArticleIndexPage() {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		apiArticle.all()
			.then((data) => setArticles(data))
			.catch(console.error);
	}, []);

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center mb-6">
				<h1>Articles</h1>
				<div>
					<Button type="primary" onClick={() => setDialogOpen(true)}>Nouveau</Button>
				</div>
			</div>
			<div>
				<ul>
					{articles.map((article) => (
						<li key={article.id}>
							<Card heading={article.title} border>
								<Link to={`/articles/${article.id}`}>
									<Button variant="secondary" theme="black">Editer</Button>
								</Link>
							</Card>
						</li>
					))}
				</ul>
			</div>
			<Dialog id="new-article" isOpen={dialogOpen}>
				<Dialog.Header id="new-article-title" title="Nouvel article" iconLeft={<IconDocument aria-hidden/>}/>
				<Dialog.Content>
					<p className="mb-8">
						Vous vous apprettez à créer un nouvel article. Veuillez d'abord renseigner quelques informations de base.
					</p>
					<CreateArticleForm onClose={() => setDialogOpen(false)}/>
				</Dialog.Content>
			</Dialog>
		</DashboardLayout>
	);
}

function CreateArticleForm({onClose}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const formik = useFormik({
		initialValues: {title: "", slug: ""},
		validationSchema: newArticleSchema,
		validateOnChange: false,
		onSubmit: ({title, slug}) => {
			setLoading(true);
			apiArticle.create({title, slug})
				.then((data) => {
					setLoading(false);
					router.pushAdmin(`/articles/${data.id}`);
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
				});
		},
	});

	/** @param {InputEvent} event */
	function handleFormChange(event) {
		const name = event.target.name;
		let value = event.target.value;

		if (name === "title") {
			// Auto-fill slug only if the slug has not been manually modified
			if (slug(formik.values.title) === formik.values.slug) {
				formik.setFieldValue("slug", slug(value));
			}
		} else if (name === "slug") {
			value = slug(value);
		}

		formik.handleChange({...event, target: {name, value}});
	}

	return (
		<form onSubmit={formik.handleSubmit}>
			<TextInput
				type="text"
				id="title"
				name="title"
				label="Titre"
				className="mb-6"
				required
				onChange={handleFormChange}
				value={formik.values.title}
				errorText={formik.errors.title}
				invalid={formik.errors.title}
			/>

			<TextInput
				type="text"
				id="slug"
				name="slug"
				label="Slug"
				helperText="Text affiché dans le lien pour identifier l'article"
				className="mb-6"
				required
				onChange={handleFormChange}
				value={formik.values.slug}
				errorText={formik.errors.slug}
				invalid={formik.errors.slug}
			/>

			<div className="mb-6">
				<Button theme="black" variant="secondary" className="mr-4" onClick={onClose} disabled={loading}>Annuler</Button>
				<Button type="submit" isLoading={loading} loadingText="Création...">Créer</Button>
			</div>
		</form>
	);
}