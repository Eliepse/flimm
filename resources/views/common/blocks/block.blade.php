<?php
/** @var string $type */
/** @var array $data */
?>

@switch($type)
	@case("header")
	@include("common.blocks.header", $data)
	@break

	@case("image")
	@include("common.blocks.image", $data)
	@break

	@case("paragraph")
	@include("common.blocks.paragraph", $data)
	@break

	@case("embed")
	@include("common.blocks.embed", $data)
	@break
@endswitch

