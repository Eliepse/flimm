import { EntityBroker } from "./broker";
import { ParseResponseData, PrepareQueryData } from "lib/classes/dataTransformer";
import EmptyTransformer from "lib/classes/transformers/EmptyTransformer";

const TRANSFORMERS = [new EmptyTransformer()];

export class SelectionBroker extends EntityBroker {
	/**
	 * @param {Number|String} editionId - The ID of the parent edition
	 */
	constructor(editionId) {
		super(
			`/editions/${editionId}/selections`,
			new ParseResponseData(...TRANSFORMERS),
			new PrepareQueryData(...TRANSFORMERS)
		);
	}
}

//const BROKER = new SelectionBroker(
//	basePath,
//	new ParseResponseData(...TRANSFORMERS),
//	new PrepareQueryData(...TRANSFORMERS)
//);
