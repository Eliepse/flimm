<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
	<link rel="stylesheet" href="{{ mix("/css/public.css") }}">
	<title>FLiMM</title>
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

<script src="{{ mix("/js/public.js") }}"></script>

</body>
</html>