<?php
/**
 * @var string $service
 * @var string $source
 * @var string $embed
 * @var int $width
 * @var int $height
 * @var string $caption
 */
?>
<figure class="embed iframe">
	<iframe
		src="{{ $embed }}"
		@isset($width) width="{{ $width }}" @endisset
		@isset($height) height="{{ $height }}" @endisset
		allowfullscreen
	>
	</iframe>
	@if(!empty($caption))
		<figcaption>{!! $caption !!}</figcaption>
	@endif
</figure>
