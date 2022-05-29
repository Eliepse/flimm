/* eslint-disable no-undef */

const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	// [Public]
	.sass("resources/scss/public.scss", "public/css", {}, [tailwindcss("./tailwind.config.js")])
	.js("resources/js/public.js", "public/js")
	// [Admin]
	.js("resources/js/index.js", "public/js")
	.sass("resources/scss/app.scss", "public/css", {}, [tailwindcss("./tailwind.admin.config.js")])
	// Below applies on all, but not sure it can be improved (scoped to admin)
	.extract()
	.alias({
		components: path.join(__dirname, "resources/js/components"),
		configs: path.join(__dirname, "resources/js/configs"),
		lib: path.join(__dirname, "resources/js/lib"),
		pages: path.join(__dirname, "resources/js/pages"),
		reducers: path.join(__dirname, "resources/js/reducers"),
		app$: path.join(__dirname, "resources/js/app.js"),
	})
	.webpackConfig({ plugins: [new AntdDayjsWebpackPlugin()], resolve: { fallback: { path: false } } })
	.react();

if (mix.inProduction()) {
	mix.version();
} else {
	mix.sourceMaps();
	mix.disableNotifications();
}
