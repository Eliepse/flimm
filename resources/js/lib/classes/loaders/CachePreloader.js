/* eslint-disable no-unused-vars */
import { optionFn } from "lib/support/functions";

/**
 * The base class of any CachePreloader.
 * Holds the logic of loading the data, but has to be extends
 * in order to tell how to configure the request, how to prepare the data
 * before caching them, and how to store them in the cache.
 *
 * @abstract
 */
export default class CachePreloader {
	static STATE_ERROR = -1;
	static STATE_PENDING = 0;
	static STATE_LOADING = 1;
	static STATE_LOADED = 2;
	static STATE_DONE = 3;

	/**
	 * @param {String} name - A name to associate the process and data (used in logging)
	 * @param {Function} onUpdate - Triggered on different steps of the process
	 * @abstract
	 */
	constructor(name, onUpdate) {
		this.name = name;
		this.onUpdate = optionFn(onUpdate);
		this.logPrefix = `[Cache Preload][${this.name}]`;
		this.state = CachePreloader.STATE_PENDING;
		this.data = null;
		this.error = null;
	}

	/**
	 * Launch the process of fetching and caching.
	 *
	 * @param {AbortSignal} signal - The signal from an AbortController, passed to the request
	 * @param {Dispatch<any>} dispatch - Redux _dispatch_ function
	 * @returns {Promise} - Resolve once complete, reject on request error
	 */
	load(signal, dispatch) {
		this.state = CachePreloader.STATE_LOADING;
		console.info(`${this.logPrefix} loading...`);
		this.onUpdate(this);

		return new Promise((resolve, reject) => {
			this._prepareRequestConfig()
				.then((res) => {
					// Prepare data for caching
					this.data = this._prepareData(res.data);
					this.state = CachePreloader.STATE_LOADED;
					this.onUpdate(this);

					// Caching data
					this._cacheData(dispatch);
					console.info(`${this.logPrefix} cached`);
					this.state = CachePreloader.STATE_DONE;
					this.onUpdate(this);

					// Optimization: Flush the data from memory once cached
					this.data = null;

					resolve(this);
				})
				.catch((e) => {
					// Prevents memory leak with aborted requests
					if (e instanceof DOMException && e.code === e.ABORT_ERR) {
						return;
					}

					console.info(`${this.logPrefix} failed`);
					this.state = CachePreloader.STATE_ERROR;
					this.error = e;
					this.onUpdate(this);
					reject(this);
				});
		});
	}

	/**
	 * Prepare and run the request, returns a promise of the request
	 *
	 * @returns {Promise}
	 * @protected
	 * @abstract
	 */
	_prepareRequestConfig() {
		throw new Error("Must be implemented by sub-class");
	}

	/**
	 * Prepare the data returned by the request before caching it.
	 *
	 * @param {*} rawData
	 * @protected
	 * @abstract
	 */
	_prepareData(rawData) {
		throw new Error("Must be implemented by sub-class");
	}

	/**
	 * Store the data (previously prepared) to the cache.
	 *
	 * @param dispatch - Redux _dispatch_ function
	 * @protected
	 * @abstract
	 */
	_cacheData(dispatch) {
		throw new Error("Must be implemented by sub-class");
	}
}
