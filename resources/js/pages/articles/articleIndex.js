import slug from "slug";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Badge, Button, Form, Input, Modal, Table, Tag } from "antd";
import apiArticle from "lib/api/apiArticle";
import { useRouter } from "lib/useRouter";
import { EditOutlined, EyeOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "app";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";

const COLUMNS = [
	{
		title: "title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "status",
		key: "status",
		render: (article) => <StatusCell article={article} />,
	},
	{
		title: "Dernière modification",
		dataIndex: "updated_at",
		key: "updated_at",
		render: (date) => date?.format("L LT"),
	},
	{
		key: "actions",
		width: 200,
		render: (article) => <ActionsCell article={article} />,
	},
];

const ArticleIndexPage = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		apiArticle
			.all()
			.then((data) => setArticles(data))
			.catch(console.error);
	}, []);

	const title = (
		<span className="inline-flex items-center">
			Articles
			<Badge
				count={articles.length}
				overflowCount={99999}
				className="ml-2"
				style={{
					backgroundColor: "#f3f4f6",
					color: "#4b5563",
				}}
			/>
		</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			actions={
				<Button icon={<PlusOutlined />} type="primary" onClick={() => setDialogOpen(true)}>
					Nouveau
				</Button>
			}
		>
			<Table
				dataSource={articles.map((article) => ({
					...article,
					key: article.id,
				}))}
				columns={COLUMNS}
				pagination={false}
			/>
			<CreateArticleForm visible={dialogOpen} onClose={() => setDialogOpen(false)} />
		</TitleAndActionsLayout>
	);
};

const CreateArticleForm = ({ visible, onClose }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isAutoSlug, setIsAutoSlug] = useState(true);
	const [form] = Form.useForm();

	// Reset the auto-slug onClose
	useEffect(() => {
		if (visible === false) {
			setIsAutoSlug(true);
		}
	}, [visible]);

	function handleValuesChanged(changedValue) {
		const changedNames = Object.keys(changedValue);
		if (changedNames.includes("title") && isAutoSlug) {
			form.setFields([{ name: "slug", value: slug(changedValue.title) }]);
		} else if (changedNames.includes("slug")) {
			form.setFields([{ name: "slug", value: slug(changedValue.slug) }]);
			setIsAutoSlug(false);
		}
	}

	function handleSubmit(values) {
		if (loading) {
			return;
		}

		setLoading(true);
		apiArticle
			.create(values)
			.then((data) => router.pushAdmin(`/articles/${data.id}`))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}

	return (
		<Modal visible={visible} onCancel={onClose} onOk={form.submit} okText={loading ? "Création..." : "Créer"}>
			<h2 className="text-lg font-bold mb-4">
				<FileTextOutlined className="mr-2" />
				Nouvel article
			</h2>
			<p className="text-gray-600 mb-8">
				Vous vous apprettez à créer un nouvel article. Veuillez d&apos;abord renseigner quelques informations de base.
			</p>
			<Form form={form} onValuesChange={handleValuesChanged} onFinish={handleSubmit} layout="vertical">
				<Form.Item label="Titre" name="title" rules={[{ required: true }]}>
					<Input required disabled={loading} />
				</Form.Item>
				<Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
					<Input required disabled={loading} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

CreateArticleForm.propTypes = {
	visible: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

const ActionsCell = ({ article }) => (
	<>
		<Link key="edit" to={`/articles/${article.id}`}>
			<Button size="small" type="primary" icon={<EditOutlined />} className="mr-2">
				Editer
			</Button>
		</Link>
		<Button
			key="view"
			size="small"
			type="link"
			href={`/actus/${article.slug}`}
			rel="noreferrer"
			target="_blank"
			icon={<EyeOutlined />}
		>
			Afficher
		</Button>
	</>
);

ActionsCell.propTypes = {
	article: PropTypes.object,
};

const StatusCell = ({ article }) => {
	if (article.published_at) {
		return <Tag color="green">Publié</Tag>;
	}

	return <Tag>Brouillon</Tag>;
};

StatusCell.propTypes = {
	article: PropTypes.object,
};

export default ArticleIndexPage;
