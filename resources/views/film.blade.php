@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Film $film
 */
?>

@section("main")
	<header class="page-header">
		@if($film->thumbnail)
			<img src="{{ $film->thumbnail->getUrl() }}" class="page-headerImage" alt="" />
		@endif
		<h1 class="page-title">{{ $film->title }}</h1>
		@if(!empty($film->synopsis))
			<p class="page-excerpt">{{ $film->synopsis }}</p>
		@endif
		{{--		<p class="article-publishDate">--}}
		{{--			<time>{{ $film->published_at->format("d.m.y") }}</time>--}}
		{{--		</p>--}}
	</header>
	<div class="page-content font-bold leading-tight">

		<div class="max-w-3xl">
			<div class="mb-12">
				{{ $film->filmmaker }}
				<hr class="w-8 border-t-2 border-black my-2" />
				{{ join(", ", [$film->gender, $film->year, "$film->duration'"]) }}<br />
				@if($film->production_name)
					({{ $film->production_name }})
				@endif
			</div>

			@if($film->description)
				<p>{{ $film->description }}</p>
			@endif
		</div>

	</div>
@endsection