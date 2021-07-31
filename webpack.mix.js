const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");
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

mix.alias({
	components: path.join(__dirname, "resources/js/components"),
	configs: path.join(__dirname, "resources/js/configs"),
	lib: path.join(__dirname, "resources/js/lib"),
	pages: path.join(__dirname, "resources/js/pages"),
	app$: path.join(__dirname, "resources/js/app.js"),
});

mix
	.extract(["react", "react-dom"])
	.js("resources/js/index.js", "public/js")
	.sass("resources/scss/app.scss", "public/css", {})
	.options({
		postCss: [tailwindcss("./tailwind.config.js")],
	})
	.react();

mix
	.sass("resources/scss/public.scss", "public/css", {})
	.js("resources/js/public.js", "public/js")
	.options({
		postCss: [tailwindcss("./tailwind.config.js")],
	});

if (!mix.inProduction()) {
	mix.disableNotifications();
}
