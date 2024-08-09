import dayjs from "dayjs";
import { Transformer } from "lib/classes/dataTransformer";
import { dateToApi, isDate, isParsableDate } from "lib/support/dates";

export default class DateTransformer extends Transformer {
	shouldTransformQuery(name, value) {
		if (super.shouldTransformQuery(name, value)) {
			return !isParsableDate(value);
		}

		return false;
	}

	transformQuery(value) {
		return dateToApi(value);
	}

	transformResponse(value) {
		if (!value) {
			return null;
		}

		return new Date(value);
	}
}
