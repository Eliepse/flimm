import { EntityBroker } from "./broker";
import { ParseResponseData, PrepareQueryData } from "lib/classes/dataTransformer";
import DaysJSTransformer from "lib/classes/transformers/DayJSTransformer";
import EmptyTransformer from "lib/classes/transformers/EmptyTransformer";

const basePath = "/sessions";

const TRANSFORMERS = [new DaysJSTransformer(["start_at"]), new EmptyTransformer()];

const BROKER = new EntityBroker(
	basePath,
	new ParseResponseData(...TRANSFORMERS),
	new PrepareQueryData(...TRANSFORMERS)
);

export default BROKER;
