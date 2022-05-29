/* eslint-disable no-undef */

const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");
const path = require("path");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

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

mix.alias({
	components: path.join(__dirname, "resources/js/components"),
	configs: path.join(__dirname, "resources/js/configs"),
	lib: path.join(__dirname, "resources/js/lib"),
	pages: path.join(__dirname, "resources/js/pages"),
	reducers: path.join(__dirname, "resources/js/reducers"),
	app$: path.join(__dirname, "resources/js/app.js"),
});

mix
	.extract()
	.js("resources/js/index.js", "public/js")
	.sass("resources/scss/app.scss", "public/css", {})
	.sourceMaps()
	.webpackConfig({
		plugins: [new AntdDayjsWebpackPlugin()],
		resolve: { fallback: { path: false } },
	})
	.options({
		postCss: [tailwindcss("./tailwind.admin.config.js")],
	})
	.react();

if (mix.inProduction()) {
	mix.version();
} else {
	mix.disableNotifications();
}
