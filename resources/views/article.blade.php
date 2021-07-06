@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Article $article
 */
?>

@section("main")
	<header class="article-header">
		@if($article->thumbnail)
			<img src="{{ $article->thumbnail->getUrl() }}" class="article-headerImage" alt="" />
		@endif
		<h1 class="article-title">{{ $article->title }}</h1>
		<p class="article-publishDate"><time>{{ $article->published_at->format("j.n.y") }}</time></p>
	</header>
	@foreach($article->content->getBlocks() as $block)
		@include("common.blocks.block", $block)
	@endforeach
@endsection