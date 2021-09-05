import Api, { formatDatesValues, formatEmptyValue, formatObjectValues } from "./broker";
import { parseToDaysjs } from "lib/support/forms";

const basePath = "/editions";

export function all() {
	return new Promise((resolve, reject) => {
		Api.get(basePath)
			.then((data) => resolve(data.map(parseEdition)))
			.catch(reject);
	});
}

export function get(id) {
	return new Promise((resolve, reject) => {
		Api.get(`${basePath}/${id}`)
			.then((data) => resolve(parseEdition(data)))
			.catch(reject);
	});
}

export function create(edition) {
	return Api.postMultipart(basePath, prepareEditionData(edition));
}

export function update({ id, ...edition }) {
	return Api.postMultipart(`${basePath}/${id}`, prepareEditionData(edition));
}

function parseEdition(data) {
	const schedules = (data.schedules || []).map((schedule) => parseToDaysjs(schedule, ["start_at"]));

	return {
		...parseToDaysjs(data, ["published_at", "open_at", "close_at", "created_at", "updated_at"]),
		schedules,
	};
}

const apiArticle = { all, get, create, update };

function prepareEditionData(data) {
	const cleanedData = formatObjectValues(formatEmptyValue(formatDatesValues(data)));
	const params = new FormData();

	Object.entries(cleanedData).forEach(([name, value]) => {
		//noinspection JSCheckFunctionSignatures
		params.set(name, value);
	});

	return params;
}

export default apiArticle;
