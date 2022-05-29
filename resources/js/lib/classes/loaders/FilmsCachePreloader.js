import CachePreloader from "lib/classes/loaders/CachePreloader";
import { hydrateFilms } from "reducers/filmsSlice";
import apiFilm from "lib/api/apiFilm";

/**
 * Cache preloader of Areas
 */
export default class FilmsCachePreloader extends CachePreloader {
	constructor(onUpdate) {
		super("films", onUpdate);
	}

	_prepareRequestConfig() {
		return apiFilm.all();
	}

	_prepareData(rawData) {
		return rawData || [];
	}

	_cacheData(dispatch) {
		// noinspection JSCheckFunctionSignatures
		dispatch(hydrateFilms(this.data));
	}
}
