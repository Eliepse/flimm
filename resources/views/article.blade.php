@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Article $article
 */
?>

@section("main")
	<header class="page-header">
		@if($article->thumbnail)
			<img src="{{ $article->thumbnail->getUrl() }}" class="page-headerImage" alt=""/>
		@endif
		<h1 class="page-title">{{ $article->title }}</h1>
		@if(!empty($article->excerpt))
			<p class="page-excerpt">{{ $article->excerpt }}</p>
		@endif
		<p class="page-publishDate">
			<time>{{ $article->published_at->format("d.m.y") }}</time>
		</p>
	</header>
	<div class="page-content">
		@foreach($article->content->getBlocks() as $block)
			@include("common.blocks.block", $block)
		@endforeach
	</div>
@endsection