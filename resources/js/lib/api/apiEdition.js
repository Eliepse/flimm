import Api from "./broker";
import { ParseResponseData, PrepareQueryData } from "lib/classes/dataTransformer";
import DaysJSTransformer from "lib/classes/transformers/DayJSTransformer";
import FileTransformer from "lib/classes/transformers/FileTransformer";
import EmptyTransformer from "lib/classes/transformers/EmptyTransformer";
import ConvertToFormData from "lib/classes/ConvertToFormData";

const basePath = "/editions";

const TRANSFORMERS = [
	new FileTransformer(["thumbnail", "program", "poster", "brochure", "flyer"], true),
	new DaysJSTransformer(["published_at", "open_at", "close_at", "created_at", "updated_at"]),
	new EmptyTransformer(),
];
const PARSER = new ParseResponseData(...TRANSFORMERS);
const CONVERTER = new ConvertToFormData(new PrepareQueryData(...TRANSFORMERS));

export function all() {
	return Api.get(basePath).then((data) => PARSER.parseAll(data));
}

export function get(id) {
	return Api.get(`${basePath}/${id}`).then((data) => PARSER.parse(data));
}

export function create(edition) {
	return Api.postMultipart(basePath, CONVERTER.convert(edition)).then((data) => PARSER.parse(data));
}

export function update({ id, ...edition }) {
	return Api.postMultipart(`${basePath}/${id}`, CONVERTER.convert(edition)).then((data) => PARSER.parse(data));
}

const apiArticle = { all, get, create, update };

export default apiArticle;
