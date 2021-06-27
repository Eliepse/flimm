import Api from './broker';

const basePath = "/articles";

export function all() {
	return Api.get(basePath);
}

export function get(id) {
	return Api.get(`${basePath}/${id}`);
}

export function create(article) {
	return Api.post(basePath, article);
}

export function update(article) {
	return Api.put(`${basePath}/${article.id}`, article);
}

export function remove(article) {
	return Api.delete(`${basePath}/${article.id}`);
}

const apiArticle = {all, get, create, update, remove};

export default apiArticle;