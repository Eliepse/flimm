import { Transformer } from "lib/classes/dataTransformer";

export default class EmptyTransformer extends Transformer {
	shouldTransformQuery(name, value) {
		return !value || super.shouldTransformQuery(name, value) || (Array.isArray(value) && value.length === 0);
	}

	transformQuery(value) {
		if (Array.isArray(value) && value.length === 0) {
			return "";
		}

		return value || "";
	}

	transformResponse(value) {
		return value;
	}
}
