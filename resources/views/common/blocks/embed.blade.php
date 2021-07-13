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
<figure>
	<iframe src="{{ $embed }}" width="{{ $width }}" height="{{ $height }}" allowfullscreen>
	</iframe>
	@if(!empty($caption))
		<figcaption>{!! $caption !!}</figcaption>
	@endif
</figure>
