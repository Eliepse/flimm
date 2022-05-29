import dayjs from "dayjs";
import { Transformer } from "lib/classes/dataTransformer";
import { dateToApi, isDate } from "lib/support/dates";

export default class DaysJSTransformer extends Transformer {
	shouldTransformQuery(name, value) {
		if (super.shouldTransformQuery(name, value)) {
			return !isDate(value) || !dayjs.isDayjs(value);
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

		return dayjs(value);
	}
}
