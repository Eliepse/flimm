@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Article $article
 */
?>

@section("main")
	<header class="article-header">
		@if($article->thumbnail)
			<img src="{{ $article->thumbnail->getUrl() }}" class="article-headerImage" alt=""/>
		@endif
		<h1 class="article-title">{{ $article->title }}</h1>
		@if(!empty($article->excerpt))
			<p class="article-excerpt">{{ $article->excerpt }}</p>
		@endif
		<p class="article-publishDate">
			<time>{{ $article->published_at->format("d.m.y") }}</time>
		</p>
	</header>
	<div class="article-content">
		@foreach($article->content->getBlocks() as $block)
			@include("common.blocks.block", $block)
		@endforeach
	</div>
@endsection