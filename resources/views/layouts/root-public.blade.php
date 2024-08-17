<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<title>FLiMM</title>
    @vite(["resources/scss/public.scss"])
</head>
<body>

<div class="root">

	@include("common.header")

	<div class="mainContent">
		@include("common.navigation")

		<main class="page">
			@yield("main")
		</main>
	</div>

</div>

@vite(["resources/js/public.js"])

{!! env("TRACKING_SCRIPT") !!}

</body>
</html>
