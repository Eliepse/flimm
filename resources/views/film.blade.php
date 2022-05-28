@extends("layouts.root-public")

<?php
use App\Models\Film;use App\Models\Session;use Carbon\Carbon;

/**
 * @var Film $film
 */
?>

@section("main")
	<header class="page-header">
		@if($film->thumbnail)
			<img src="{{ $film->thumbnail->getUrl() }}" class="page-headerImage" alt="" />
		@endif

		<h1 class="page-title">{{ $film->title }}</h1>

		@if(!empty($film->description))
			<p class="page-excerpt">{{ $film->description }}</p>
		@endif

		@if($film->trailer_link)
			<a href="{{ $film->trailer_link }}" rel="noreferrer nofollow" target="_blank">
				<div class="inline-block mt-4 px-3 py-2 bg-black text-white hover:underline">
					Voir la bande annonce
				</div>
			</a>
		@endif
	</header>
	<div class="page-content font-bold leading-tight">

		<div class="max-w-3xl">
			<div class="mb-12">
				{{ $film->filmmaker }}
				<hr class="w-8 border-t-2 border-black my-2" />
				{{ join(", ", array_filter([$film->gender, $film->year, "$film->duration'", $film->country])) }}<br />
				@if($film->production_name)
					({{ $film->production_name }})
				@endif
			</div>

			@if(!empty($film->synopsis))
				<p>{{ $film->synopsis }}</p>
			@endif

			@if(!empty($film->other_technical_infos))
				<hr class="max-w-xs my-6 border-t-2 border-black" />
				<p>{{ $film->other_technical_infos }}</p>
				<p>{{ $film->imdb_id }}</p>
			@endif

			@if($sessions?->count() > 0)
				<h2>Séances</h2>
				<ul>
					<?php /** @var Session $session */ ?>
					@foreach($sessions as $session)
						<li class="my-2 font-mono @if($session->start_at->isBefore(Carbon::now()->subMinutes($session->duration))) text-gray-500 line-through @endif">
							<a href="{{ route("session", $session) }}">
								{{ $session->start_at->format("d/m/Y H:i") }} -
								@if($session->edition)
									[{{ $session->edition->title }}] -
								@endif
								<em>{{ $session->title }}</em> à {{ $session->location }}
							</a>
						</li>
					@endforeach
				</ul>
			@endif
		</div>

	</div>
@endsection