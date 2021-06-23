const mix = require('laravel-mix');

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

mix.js('resources/js/index.js', 'public/js')
	.extract(['react', 'react-dom'])
	.react()
	.sass('resources/css/app.scss', 'public/css', {}, [
		require("tailwindcss"),
	]);

if (!mix.inProduction()) {
	mix.disableNotifications();
}
