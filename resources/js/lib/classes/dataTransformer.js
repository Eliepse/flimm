export class PrepareQueryData {
	/** @param {Transformer} transformers */
	constructor(...transformers) {
		this.transformers = transformers;
	}

	_passThroughTransformers(name, value) {
		const transformedValue = this.transformers.reduce((carry, transformer) => {
			if (transformer.shouldTransformQuery(name, carry)) {
				return transformer.transformQuery(carry);
			}

			return carry;
		}, value);

		return [name, transformedValue];
	}

	prepare(data) {
		const transformedData = Object.entries(data).map(([name, value]) => this._passThroughTransformers(name, value));
		return Object.fromEntries(transformedData);
	}
}

export class ParseResponseData {
	/** @param {Transformer} transformers */
	constructor(...transformers) {
		this.transformers = transformers;
	}

	_passThroughTransformers(name, value) {
		const transformedValue = this.transformers.reduce((carry, transformer) => {
			if (transformer.shouldTransformResponse(name, carry)) {
				return transformer.transformResponse(carry);
			}

			return carry;
		}, value);

		return [name, transformedValue];
	}

	parse(data) {
		const transformedData = Object.entries(data).map(([name, value]) => this._passThroughTransformers(name, value));
		return Object.fromEntries(transformedData);
	}

	parseAll(dataList) {
		return dataList.map((data) => this.parse(data));
	}
}

export class Transformer {
	/** @param {String[]=} fieldsName */
	constructor(fieldsName) {
		this.fieldsName = fieldsName;
	}

	/**
	 * Check wether a given field should be transformed or not.
	 * By default, it does not filter or only transforms fields which names
	 * has been set in fieldsName.
	 * Feel free to override this method to customize the test.
	 *
	 * @param {String} name
	 * @param {*} value
	 * @return {boolean}
	 */
	//eslint-disable-next-line no-unused-vars
	shouldTransformQuery(name, value) {
		return this.isFieldWhitelisted(name);
	}

	/**
	 * Check wether a given field should be transformed or not.
	 * By default, it does not filter or only transforms fields which names
	 * has been set in fieldsName.
	 * Feel free to override this method to customize the test.
	 *
	 * @param {String} name
	 * @param {*} value
	 * @return {boolean}
	 */
	//eslint-disable-next-line no-unused-vars
	shouldTransformResponse(name, value) {
		return this.isFieldWhitelisted(name);
	}

	/**
	 * Checks if a fieldName is present in the list of fields to transform.
	 *
	 * @param {String} name
	 * @return {boolean}
	 */
	isFieldWhitelisted(name) {
		if (!this.fieldsName) {
			return false;
		}

		return this.fieldsName.includes(name);
	}

	/**
	 * Transform the data before sending it to the api.
	 *
	 * @abstract
	 * @param {*} value
	 * @returns {*}
	 */
	//eslint-disable-next-line no-unused-vars
	transformQuery(value) {
		throw new Error("must be implemented by subclass!");
	}

	/**
	 * Transform the data once fetched from the api.
	 *
	 * @abstract
	 * @param {*} value
	 * @returns {*}
	 */
	//eslint-disable-next-line no-unused-vars
	transformResponse(value) {
		throw new Error("must be implemented by subclass!");
	}
}
