import { EntityBroker } from "./broker";
import { ParseResponseData, PrepareQueryData } from "lib/classes/dataTransformer";
import DaysJSTransformer from "lib/classes/transformers/DayJSTransformer";
import FileTransformer from "lib/classes/transformers/FileTransformer";
import EmptyTransformer from "lib/classes/transformers/EmptyTransformer";

const basePath = "/editions";

const TRANSFORMERS = [
	new FileTransformer(["thumbnail", "program", "poster", "brochure", "flyer"], true),
	new DaysJSTransformer(["published_at", "open_at", "close_at", "created_at", "updated_at"]),
	new EmptyTransformer(),
];

const BROKER = new EntityBroker(
	basePath,
	new ParseResponseData(...TRANSFORMERS),
	new PrepareQueryData(...TRANSFORMERS)
);

export default BROKER;
