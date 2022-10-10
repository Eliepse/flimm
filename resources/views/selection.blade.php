@extends("layouts.root-public")
<!--suppress CheckEmptyScriptTag -->

<?php
/**
 * @var \App\Models\Edition $edition
 * @var \App\Models\Selection $selection
 */

$breadcrumbItems = [
	["title" => $edition->title, "url" => route("edition", $edition)],
	["title" => $selection->name],
]
?>
@section("main")
	<div class="page-content">
		<x-breadcrumb :items="$breadcrumbItems" />

		{{-- SELECTION HEADER --}}
		<h1 class="uppercase mt-8 mb-12">{{ $selection->name }}</h1>

		@if($selection->intro)
			<p class="text-gray-500 text-xl leading-tight -mt-8">@nl2br($selection->intro)</p>
		@endif

		{{-- FILMS --}}
		@foreach($selection->films as $film)
			<x-film-card :film="$film" classes="my-16" />
		@endforeach
	</div>
@endsection