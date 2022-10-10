@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Session $session
 */
?>

@section("main")
	<header class="page-header">
		<h1 class="page-title">
			<span class="inline-block mb-2 text-base px-2 bg-black text-white rounded">Séance</span><br />
			{{ $session->title }}
		</h1>
		@if(!empty($session->excerpt))
			<p class="page-excerpt">{{ $session->excerpt }}</p>
		@endif
		<p class="page-publishDate text-xl">
			<time>{{ $session->start_at->format("d.m.y à G \h i") }}</time><br />
			{{ $session->location }}
		</p>
	</header>
	<div class="page-content">
		{{-- Description --}}
		@foreach($session->description?->getBlocks() ?? [] as $block)
			@include("common.blocks.block", $block)
		@endforeach

		{{-- Films --}}
		<h2 class="text-lg">Film(s)</h2>
		<ul>
			@foreach($session->films as $film)
				<li class="my-12">
					<!--suppress CheckEmptyScriptTag, HtmlUnknownTag -->
					<x-film-card :film="$film" />
				</li>
			@endforeach
		</ul>
	</div>
@endsection