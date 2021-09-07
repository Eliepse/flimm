<?php

use App\Repositories\SettingRepository;

/**
 * @var SettingRepository $settings
 */
$settings = app(SettingRepository::class);
?>
<header class="flex py-2 px-6 justify-between border-b-2 border-black leading-tight font-bold">
	<div>
		FLiMM<br>
		Festival Libre du Moyen-Métrage<br>
		@nl2br(app(\App\Repositories\SettingRepository::class)->get("header.text")?->value)
	</div>
	<ul class="flex items-end">
		@if($settings->isFilled("socials.instagram"))
			<li>
				<a href="{{ $settings->get("socials.instagram")->value }}" rel="noreferrer nofollow">
					<?php include public_path("images/instagram.svg") ?>
				</a>
			</li>
		@endif

		@if($settings->isFilled("socials.facebook"))
			<li class="ml-4">
				<a href="{{ $settings->get("socials.facebook")->value }}" rel="noreferrer nofollow">
					<?php include public_path("images/facebook.svg") ?>
				</a>
			</li>
		@endif
	</ul>
</header>
