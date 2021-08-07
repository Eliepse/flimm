import Api from "./broker";

const basePath = "/films";

export function all() {
	return Api.get(basePath);
}

export function get(id) {
	return Api.get(`${basePath}/${id}`);
}

export function create(film) {
	return Api.postMultipart(basePath, prepareFilmData(film));
}

export function update(film) {
	return Api.postMultipart(`${basePath}/${film.id}`, prepareFilmData(film));
}

const apiArticle = { all, get, create, update };

function prepareFilmData(data) {
	const params = new FormData();

	params.set("title", data.title || "");
	params.set("title_override", data.title_override || "");
	params.set("duration", data.duration || "");
	params.set("synopsis", data.synopsis || "");
	params.set("description", data.description || "");
	params.set("filmmaker", data.filmmaker || "");
	params.set("technical_members", data.technical_members || "");
	params.set("gender", data.gender || "");
	params.set("year", data.year || "");
	params.set("production_name", data.production_name || "");
	params.set("country", data.country || "");
	params.set("other_technical_infos", data.other_technical_infos || "");
	params.set("website_link", data.website_link || "");
	params.set("video_link", data.video_link || "");
	params.set("trailer_link", data.trailer_link || "");
	params.set("imdb_id", data.imdb_id || "");

	if (typeof data.thumbnail !== "string") {
		params.set("thumbnail", data.thumbnail || "");
	}

	return params;
}

export default apiArticle;
