<?php
use App\Models\Article;

/**
 * @var Article $article
 */
?>

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