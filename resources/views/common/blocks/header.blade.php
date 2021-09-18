<?php
/** @var string $text */
/** @var string $level */
?>
@switch($level ?? 2)
	@case(1)
	<h1>{{ $text }}</h1>
	@break

	@case(2)
	<h2>{{ $text }}</h2>
	@break

	@case(3)
	<h3>{{ $text }}</h3>
	@break

	@case(4)
	<h4>{{ $text }}</h4>
	@break

	@case(5)
	<h5>{{ $text }}</h5>
	@break

	@case(6)
	<h6>{{ $text }}</h6>
	@break

	@default
	<h2>{{ $text }}</h2>
@endswitch
