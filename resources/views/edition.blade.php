@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Edition $edition
 */
?>

@section("main")
	<header class="page-header">
		@if($edition->thumbnail)
			<img src="{{ $edition->thumbnail->getUrl() }}" class="page-headerImage" alt="" />
		@endif

		<h1 class="page-title">{{ $edition->title }}</h1>

		<ul class="page-links-list">
			@if($edition->poster)
				<li>
					<a href="{{ $edition->poster->getUrl() }}" download>
						L'affiche
					</a>
				</li>
			@endif

			@if($edition->brochure)
				<li>
					<a href="{{ $edition->brochure->getUrl() }}" download>
						La brochure
					</a>
				</li>
			@endif

			@if($edition->program)
				<li>
					<a href="{{ $edition->program->getUrl() }}" download>
						Le programme
					</a>
				</li>
			@endif

			@if($edition->flyer)
				<li>
					<a href="{{ $edition->flyer->getUrl() }}" download>
						Le flyer
					</a>
				</li>
			@endif
		</ul>

	</header>
	<div class="page-content font-bold leading-tight">
		<div class="max-w-3xl">

			@if($edition->presentation)
				<p class="mb-12">{{ $edition->presentation }}</p>
			@endif

		</div>
	</div>
@endsection