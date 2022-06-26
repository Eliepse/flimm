<?php
/**
 * @var \App\Models\Film[] $films
 */
?>

<ul class="filmGrid">
	@foreach($films as $film)
		<li class="filmGrid-cell">
			<a href="{{ route("film", $film) }}" class="no-underline">
				<div class="filmGrid-item" @if($film->thumbnail)style="background-image: url('{{ $film->thumbnail->getUrl() }}')"@endif>
					<div class="filmGrid-itemContent">
						<span class="filmGrid-itemTitle">{{ $film->title }}</span>
						<span class="filmGrid-itemFilmmaker">{{ $film->filmmaker }}</span>
					</div>
				</div>
			</a>
		</li>
	@endforeach
</ul>
