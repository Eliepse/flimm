import HeaderTool from "@editorjs/header";
import EmbedTool from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import { getCsrfToken } from "lib/api/broker";

export const TOOL_HEADER = {
	class: HeaderTool,
	config: {
		levels: [2, 3, 4],
		defaultLevel: 2,
	},
};

export const TOOL_EMBED = EmbedTool;

export const makeImageTool = (endpoint) => ({
	class: ImageTool,
	config: {
		endpoints: { byFile: endpoint },
		additionalRequestHeaders: { "X-XSRF-TOKEN": getCsrfToken() },
	},
});

export const DEFAULT_TOOLS = {
	header: TOOL_HEADER,
	embed: TOOL_EMBED,
};
