@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Edition $edition
 * @var \App\Models\Selection $selection
 */
?>

@section("main")

	<div class="page-content">
		{{-- SELECTION HEADER --}}
		<h1 class="uppercase mt-8 mb-12">{{ $selection->name }}</h1>

		{{-- FILMS --}}
		@foreach($selection->films as $film)
			<!--suppress CheckEmptyScriptTag -->
			<x-film-card :film="$film" />
		@endforeach
	</div>
@endsection