import CachePreloader from "lib/classes/loaders/CachePreloader";

/**
 * Load a serie of Cache Preloader and manage global state
 * of the process (progression, updates, completion).
 * Makes it easy to run a CachePreloader without having to bother with creating
 * an AbortController (you still have to abort the CachePreloaderWorker on unmount);
 */
export default class CachePreloadWorker {
	/** @type {CachePreloader[]} */
	preloaders = [];
	loadingAttempts = 0;
	logPrefix = `[CachePreloadWorker]`;

	static MAX_ATTEMPTS = 2;

	static STATE_PENDING = 0;
	static STATE_LOADING = 1;
	static STATE_DONE = 9;
	static STATE_ERROR = -1;

	/**
	 *
	 * @param {CachePreloader} preloaders
	 */
	constructor(...preloaders) {
		this.state = CachePreloadWorker.STATE_PENDING;
		this.abortController = {}; // Will be set when calling load()

		// Events that can be overwritten
		this.onPreloaderUpdate = () => null;
		this.onPreloaderDone = () => null;

		// Prepare preloaders
		preloaders.forEach((p) => this.addPreloader(p));
	}

	/**
	 * Add a preloader and connect to its update event.
	 *
	 * @param {CachePreloader} preloader
	 * @returns {this}
	 */
	addPreloader(preloader) {
		preloader.onUpdate = (p) => this._onPreloaderUpdate(p);
		this.preloaders.push(preloader);
		return this;
	}

	/**
	 * @param {Dispatch<any>} dispatch - The _dispatch_ function from Redux
	 * @returns {Promise} - Resolve when all CachePreloader are DONE or ERROR.
	 */
	load(dispatch) {
		// We must create an abort controller that will signal
		// all CachePreloaders request to abort (if needed).
		this.abortController = new AbortController();
		const { signal } = this.abortController;

		this.state = CachePreloadWorker.STATE_LOADING;

		console.groupCollapsed(`${this.logPrefix} Start preloaders`);
		this.loadingAttempts = 1;

		return new Promise((resolve, reject) => {
			Promise.allSettled(this.preloaders.map((preloader) => preloader.load(signal, dispatch))).then((res) => {
				console.groupEnd();

				if (res.find((pre) => pre.status === "rejected")) {
					this.retryFailed(dispatch).then(resolve).catch(reject);
					return;
				}

				this.state = CachePreloadWorker.STATE_DONE;
				resolve(this);
			});
		});
	}

	/**
	 * Retry preloading data of failed preloaders.
	 * Does not load preloaders with other states (ex: pending).
	 *
	 * @param {Dispatch<any>} dispatch - The _dispatch_ function from Redux
	 * @returns {Promise} - Resolve when all CachePreloader are DONE, reject otherwise.
	 */
	retryFailed(dispatch) {
		// We must create an abort controller that will signal
		// all CachePreloaders request to abort (if needed).
		this.abortController = new AbortController();
		const { signal } = this.abortController;
		this.state = CachePreloadWorker.STATE_LOADING;

		this.loadingAttempts++;

		// Take the first load as an attemps to load data, so we do not substract by 1.
		console.groupCollapsed(`${this.logPrefix} Retry failed preloaders (attempts ${this.loadingAttempts})`);

		return new Promise((resolve, reject) => {
			Promise.allSettled(this.getFailedPreloaders().map((preloader) => preloader.load(signal, dispatch))).then(
				(res) => {
					console.groupEnd();

					const hasFailedPreloaders = res.find((pre) => pre.status === "rejected") !== undefined;

					// Retry again if possible
					if (hasFailedPreloaders && this.loadingAttempts < CachePreloadWorker.MAX_ATTEMPTS + 1) {
						this.retryFailed(dispatch).then(resolve).catch(reject);
						return;
					}

					// Reject if still unable to load failed preloaders
					if (hasFailedPreloaders) {
						this.state = CachePreloadWorker.STATE_ERROR;
						reject(this);
						return;
					}

					// All good, failed preloader succeeded
					this.state = CachePreloadWorker.STATE_DONE;
					resolve(this);
				}
			);
		});
	}

	/**
	 * Abort all the requests of preloaders.
	 * Cannot be called before calling the load() method.
	 */
	abort() {
		if (typeof this.abortController.abort !== "function") {
			throw new Error("Cannot abort a CachePreloadWorker befor calling the load() method.");
		}

		this.abortController.abort();
	}

	/**
	 * Get a formatted message of the current loading state.
	 *
	 * @return {string}
	 */
	get loadingMessage() {
		const total = this.preloaders.length;
		const done = this.preloaders.filter((p) => CachePreloader.STATE_DONE === p.state).length;
		const percents = (done / total) * 100;
		return `Preloading data... (${Math.round(percents)} %)`;
	}

	/**
	 * Get all failed preloaders.
	 * Does not get preloaders with other states (ex: pending).
	 *
	 * @returns {CachePreloader[]}
	 */
	getFailedPreloaders() {
		return this.preloaders.filter((preloader) => preloader.state === CachePreloader.STATE_ERROR);
	}

	/**
	 * Check if the worker finished loading or not.
	 *
	 * @return {boolean}
	 */
	isReady() {
		return CachePreloadWorker.STATE_DONE === this.state;
	}

	/**
	 * Check if the worker has finish its job, which includes:
	 * - loading a first time
	 * - retrying failed preloaders a finite number of time
	 *
	 * @returns {Boolean}
	 */
	isEnded() {
		if (this.isReady()) {
			return true;
		}

		return CachePreloadWorker.STATE_ERROR === this.state && this.loadingAttempts > 1;
	}

	/**
	 * Handle updates from preloaders.
	 *
	 * @param {CachePreloader} preloader
	 * @private
	 */
	_onPreloaderUpdate(preloader) {
		// Trigger unfiltered listener
		this.onPreloaderUpdate(preloader);

		// Trigger specific listeners
		switch (preloader.state) {
			case CachePreloader.STATE_DONE:
				this.onPreloaderDone(preloader);
				break;
		}
	}
}
