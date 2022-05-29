@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Article $article
 */
?>

@section("main")
	{{-- Cover image --}}
	<div class="h-96 bg-cover bg-center" style="background-image: url({{ $article->thumbnail->getUrl() }})"></div>

	{{-- Title, excerpt & metadata --}}
	<header class="px-4 pt-8">
		<h1 class="uppercase mb-2">{{ $article->title }}</h1>

		@if(!empty($article->excerpt))
			<p class="font-bold">{{ $article->excerpt }}</p>
		@endif

		<p class="text-sm font-mono">
			<time>Publié le {{ $article->published_at->format("d.m.y") }}</time>
		</p>
	</header>

	{{-- Content --}}
	<div class="page-content">
		@foreach($article->content->getBlocks() as $block)
			@include("common.blocks.block", $block)
		@endforeach
	</div>
@endsection