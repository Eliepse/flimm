@extends("layouts.root-public")

<?php
/**
 * @var \App\Models\Article $article
 */
?>

@section("main")
	<h1 class="mx-auto text-center my-24">Actus</h1>
	<ul class="actus-list">
		@foreach($articles as $article)
			<li class="actus-listItem">
				<a href="{{ route("article", ["article" => $article]) }}">
					<article>
						<div
							class="actu-thumbnail"
							style="background-image: url('{{ optional($article->thumbnail)->getUrl()  }}')"
						></div>
						<h2 class="actu-title">{{ $article->title }}</h2>
					</article>
				</a>
			</li>
		@endforeach
	</ul>
@endsection