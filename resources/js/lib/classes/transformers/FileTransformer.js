import { Transformer } from "lib/classes/dataTransformer";
import { wrap } from "lib/support/arrays";

const ACTIONS = {
	delete: "DELETE",
	upload: "UPLOAD",
	update: "UPDATE",
};

export default class FileTransformer extends Transformer {
	constructor(fieldsName, singleFile = false) {
		super(fieldsName);

		this.singleFile = singleFile;
	}

	shouldTransformQuery(name, value) {
		if (!super.shouldTransformQuery(name, value)) {
			return false;
		}

		return Array.isArray(value);
	}

	/** @param {Object[]} value */
	transformQuery(value) {
		// The files must be deleted.
		if (value.length === 0) {
			return null;
		}

		const files = value.map((file) => {
			//eslint-disable-next-line no-unused-vars
			const { originFileObj, thumbUrl, ...rest } = file;
			const payload = {
				...rest,
				action: originFileObj ? ACTIONS.upload : ACTIONS.update,
			};

			if (originFileObj) {
				payload.file = originFileObj;
			}

			return payload;
		});

		return this.singleFile ? files.slice(0, 1) : files;
	}

	transformResponse(value) {
		return wrap(value);
	}
}
