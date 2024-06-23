<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8"/>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, shrink-to-fit=no"
	/>
	<meta name="theme-color" content="#000000"/>
	<!--
		manifest.json provides metadata used when your web app is added to the
		homescreen on Android. See https://developers.google.com/web/fundamentals/web-app-manifest/
	-->
{{--	<link rel="manifest" href="%PUBLIC_URL%/manifest.json"/>--}}
	<!--
		Notice the use of %PUBLIC_URL% in the tags above.
		It will be replaced with the URL of the `public` folder during the build.
		Only files inside the `public` folder can be referenced from the HTML.
		Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
		work correctly both with client-side routing and a non-root public URL.
		Learn how to configure a non-root public URL by running `npm run build`.
	-->
	<link rel="stylesheet" href="https://unpkg.com/carbon-components/css/carbon-components.min.css">
	<title>FLiMM - Admin</title>
    @viteReactRefresh
    @vite(["resources/js/index.jsx"])
</head>
<body>
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
</body>
</html>
