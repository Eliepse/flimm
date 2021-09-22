<?php
?>

<nav id="main-nav" class="mainNav">
	<ul>
		<li>
			<a href="/">Accueil</a>
		</li>
		@if(!empty($editions_list))
			@foreach($editions_list as $edition)
				<li>
					<a href="{{ route("edition", $edition->slug) }}">{{ $edition->title }}</a>
				</li>
			@endforeach
		@endif
		<li>
			<a href="{{ route("actus") }}">Actus</a>
		</li>
		<li>
			<a href="{{ route("about") }}">À Propos</a>
		</li>
	</ul>
</nav>