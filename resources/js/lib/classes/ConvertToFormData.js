import dayjs from "dayjs";
import { dateToApi } from "lib/support/dates";

export default class ConvertToFormData {
	/**
	 *
	 * @param {PrepareQueryData} preparator
	 */
	constructor(preparator) {
		this.preparator = preparator;
	}

	/**
	 *
	 * @param data
	 * @returns {FormData}
	 */
	convert(data) {
		const form = new FormData();

		function _recursiveFormDataAppender(prefix, value) {
			if (value === null || typeof value !== "object" || value instanceof File) {
				if (prefix.length === 0) {
					throw new Error("Prefix cannot be empty.");
				}
				form.set(prefix, value);
				return;
			}

			Object.entries(value).forEach(([k, v]) => _recursiveFormDataAppender(`${prefix}[${k}]`, v));
		}

		Object.entries(this.preparator.prepare(data)).forEach(([k, v]) => _recursiveFormDataAppender(k, v));

		return form;
	}
}

class Formater {
	/**
	 * @abstract
	 * @param {*=} value
	 */
	//eslint-disable-next-line no-unused-vars
	format(value) {
		throw new Error("must be implemented by subclass!");
	}

	/**
	 * @abstract
	 * @param {*} value
	 * @returns {Boolean}
	 */
	//eslint-disable-next-line no-unused-vars
	passes(value) {
		throw new Error("must be implemented by subclass!");
	}
}

class EmptyFormater extends Formater {
	//eslint-disable-next-line no-unused-vars
	format(value) {
		return value || "";
	}

	passes(value) {
		return !value;
	}
}

class DateFormater extends Formater {
	format(value) {
		if (dayjs.isDayjs(value)) {
			return dateToApi(value.toDate());
		}

		return dateToApi(value);
	}

	passes(value) {
		return dayjs.isDayjs(value) || value instanceof Date;
	}
}

class FileFormater extends Formater {
	format(value) {
		return value;
	}

	passes(value) {
		return value instanceof File;
	}
}

class ObjectFormater extends Formater {
	constructor() {
		super();
		this.formaters = [new EmptyFormater(), new FileFormater(), new DateFormater()];
	}

	_passEntryThroughFormaters(key, value) {
		for (let formater of this.formaters) {
			if (formater.passes(value)) {
				return [key, formater.format(value)];
			}

			if (this.passes(value)) {
				return [key, this.format(value)];
			}
		}

		return [key, value];
	}

	format(value) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => this._passEntryThroughFormaters(k, v)));
	}

	passes(value) {
		return typeof value === "object";
	}
}
