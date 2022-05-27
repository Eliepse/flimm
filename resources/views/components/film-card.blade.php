<a href="{{ $url }}" class="no-underline">
	<div class="filmCard {{ $classes }}">
		@isset($thumbnail)
			<img src="{{ $thumbnail }}" alt="Image du film {{ $title }}" class="filmCard-image" />
		@endisset
		<div class="filmCard-title">{{ $title }}, <span class="filmCard-filmmaker">{{ $filmmaker }}</span> <span class="filmCard-duration">({{ $duration }} min)</span></div>
	</div>
</a>