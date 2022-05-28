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
			Séance {{ $session->title }}
		</h1>
		@if(!empty($session->excerpt))
			<p class="page-excerpt">{{ $session->excerpt }}</p>
		@endif
		<p class="page-publishDate text-xl">
			<time>Début le {{ $session->start_at->format("d.m.y à h \h m") }} - {{ $session->duration }} min</time>
		</p>
	</header>
	<div class="page-content">
		<h2 class="text-lg">Films</h2>
		<ul>
			@foreach($session->films as $film)
				<li class="my-12">
					<x-film-card :film="$film" />
				</li>
			@endforeach
		</ul>
		@foreach($session->description?->getBlocks() ?? [] as $block)
			@include("common.blocks.block", $block)
		@endforeach
	</div>
@endsection