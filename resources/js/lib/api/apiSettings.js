import Api from "./broker";

const basePath = "/settings";

export function all() {
	return Api.get(basePath);
}

export function upsert(setting) {
	const params = new FormData();
	params.set("value", setting.value || "");

	return Api.postMultipart(`${basePath}/${setting.name}`, params);
}

const apiArticle = { all, upsert };

export default apiArticle;
