<?php
/**
 * @var array $file
 * @var string $caption
 */
?>
<figure>
	<img src="{{ $file["url"] }}" alt="" />
	@if(!empty($caption))
		<figcaption>{!! $caption !!}</figcaption>
	@endif
</figure>
