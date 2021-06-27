import Api from './broker';
import dayjs from 'dayjs';

const basePath = "/articles";
const dateTimeFormat = "YYYY-MM-DDTHH:mm:ssZZ";

export function all() {
	return Api.get(basePath);
}

export function get(id) {
	return Api.get(`${basePath}/${id}`);
}

export function create(article) {
	return Api.post(basePath, formatArticleData(article));
}

export function update(article) {
	return Api.put(`${basePath}/${article.id}`, formatArticleData(article));
}

export function remove(article) {
	return Api.delete(`${basePath}/${article.id}`);
}

function formatArticleData(article) {
	const {published_at} = article;

	return {
		...article,
		published_at: hasValidPublishedAt(article) ? dayjs(published_at).format(dateTimeFormat) : null,
	};
}

function hasValidPublishedAt(article) {
	return article.published_at instanceof Date;
}

const apiArticle = {all, get, create, update, remove};

export default apiArticle;