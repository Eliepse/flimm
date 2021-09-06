<?php

use App\Models\Article;use App\Repositories\SettingRepository;use Illuminate\Database\Eloquent\Collection;

/**
 * @var Collection|Article[] $actus
 * @var SettingRepository $settings
 */
?>

@extends("layouts.root-public")

@section("main")
	@if($settings->isFilled("homepage.featuredImage"))
		<?php $featuredImage = $settings->get("homepage.featuredImage") ?>
		<header class="border-b-2 border-solid border-black">
			@if($feturedImageLink = $settings->get("homepage.featuredImage.link")?->value)
				<a href="{{ $feturedImageLink }}">
					<img
						src="{{ $featuredImage->value->getFullUrl() }}" class="mx-auto my-0 object-cover"
						alt="{{ app(\App\Repositories\SettingRepository::class)->get("homepage.featuredImage.altText")?->value }}"
					/>
				</a>
			@else
				<img
					src="{{ $featuredImage->value->getFullUrl() }}" class="mx-auto my-0 object-cover"
					alt="{{ app(\App\Repositories\SettingRepository::class)->get("homepage.featuredImage.altText")?->value }}"
				/>
			@endif
		</header>
	@endif
	<section>
		@include("common.actusList", ["articles" => $actus])
	</section>
@endsection