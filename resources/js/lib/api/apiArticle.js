import Api from "./broker";
import { dateToApi } from "lib/support/dates";
import { parseToDaysjs } from "lib/support/forms";

const basePath = "/articles";

//const dateTimeFormat = "YYYY-MM-DDTHH:mm:ssZZ";

export function all() {
	return new Promise((resolve, reject) => {
		Api.get(basePath)
			.then((data) => resolve(data.map(parseArticle)))
			.catch(reject);
	});
}

export function get(id) {
	return new Promise((resolve, reject) => {
		Api.get(`${basePath}/${id}`)
			.then((data) => resolve(parseArticle(data)))
			.catch(reject);
	});
}

export function create(article) {
	return Api.post(basePath, formatArticleData(article));
}

export function update(article) {
	const data = formatArticleData(article);
	const params = new FormData();
	params.set("title", data.title || "");
	params.set("slug", data.slug || "");
	params.set("excerpt", data.excerpt || "");
	params.set("published_at", data.published_at || "");
	params.set("content", JSON.stringify(data.content));

	if (typeof data.thumbnail !== "string") {
		params.set("thumbnail", data.thumbnail || "");
	}

	return Api.post(`${basePath}/${article.id}`, params, { headers: { "Content-Type": "multipart/form-data" } });
}

export function remove(article) {
	return Api.delete(`${basePath}/${article.id}`);
}

function formatArticleData(article) {
	return {
		...article,
		published_at: dateToApi(article.published_at),
	};
}

function parseArticle(data) {
	return parseToDaysjs(data, ["published_at", "created_at", "updated_at"]);
}

const apiArticle = { all, get, create, update, remove };

export default apiArticle;
