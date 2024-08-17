import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		laravel({
			input: [
				"resources/scss/app.scss",
				"resources/scss/public.scss",
				"resources/js/index.jsx",
				"resources/js/public.js",
			],
			refresh: true,
		}),
		react(),
	],
	resolve: {
		alias: {
			components: "/resources/js/components",
			configs: "/resources/js/configs",
			lib: "/resources/js/lib",
			pages: "/resources/js/pages",
			reducers: "/resources/js/reducers",
			app$: "js/app.js",
			"@": "/resources/js",
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					base: ["clsx", "react", "react-dom", "react-redux", "react-router-dom", "@reduxjs/toolkit"],
					editor: [
						"@editorjs/editorjs",
						"@editorjs/embed",
						"@editorjs/header",
						"@editorjs/image",
						"@editorjs/paragraph",
					],
				},
			},
		},
	},
});
