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
	</header>
	<div class="page-content font-bold leading-tight">
		<div class="max-w-3xl">

			@if($edition->presentation)
				<p class="mb-12">{{ $edition->presentation }}</p>
			@endif

		</div>
	</div>
@endsection