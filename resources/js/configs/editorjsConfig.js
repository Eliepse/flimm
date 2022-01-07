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

export const TOOL_EMBED = {
	class: EmbedTool,
	config: {
		services: {
			facebook: true,
			youtube: true,
			instagram: true,
			twitter: true,
			twitch: true,
			miro: true,
			vimeo: true,
			gfycat: true,
			imgur: true,
			pinterest: true,
			airtable: {
				regex: /https?:\/\/airtable\.com\/(?:embed\/)?(.*)/,
				embedUrl: "https://airtable.com/embed/<%= remote_id %>",
				html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true'></iframe>",
				height: 900,
			},
		},
	},
};

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
