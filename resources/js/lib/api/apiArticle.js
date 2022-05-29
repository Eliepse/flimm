import Api, {
	formatAndFilterSingleFilesValues,
	formatDatesValues,
	formatEmptyValue,
	formatObjectValues,
} from "./broker";
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
	return Api.postMultipart(basePath, prepareEditionData(article));
}

export function update(article) {
	return new Promise((resolve, reject) => {
		Api.postMultipart(`${basePath}/${article.id}`, prepareEditionData(article))
			.then((data) => resolve(parseArticle(data)))
			.catch(reject);
	});
}

export function remove(article) {
	return Api.delete(`${basePath}/${article.id}`);
}

function prepareEditionData(article) {
	const cleanedData = formatObjectValues(
		formatEmptyValue(formatDatesValues(formatAndFilterSingleFilesValues(article, ["thumbnail"])))
	);

	const params = new FormData();
	Object.entries(cleanedData).forEach(([name, value]) => {
		//noinspection JSCheckFunctionSignatures
		params.set(name, value);
	});

	if (article.content) {
		params.set("content", JSON.stringify(article.content));
	}

	return params;
}

function parseArticle(data) {
	return parseToDaysjs(data, ["published_at", "created_at", "updated_at"]);
}

const apiArticle = { all, get, create, update, remove };

export default apiArticle;
