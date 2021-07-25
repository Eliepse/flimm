<?php

use App\Models\Article;
use App\Repositories\SettingRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * @var Collection|Article[] $actus
 * @var SettingRepository $settings
 */
?>

@extends("layouts.root-public")

@section("main")
	@if($featuredImage = $settings->get("homepage.featuredImage"))
		<header class="border-b-2 border-solid border-black">
			<img
				src="{{ $featuredImage->value->getFullUrl() }}" class="mx-auto my-0 object-cover"
				alt="{{ app(\App\Repositories\SettingRepository::class)->get("homepage.featuredImage.altText")?->value }}"
			/>
		</header>
	@endif
	<section>
		@include("common.actusList", ["articles" => $actus])
	</section>
@endsection