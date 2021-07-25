<header class="flex py-2 px-6 justify-between border-b-2 border-black leading-tight font-bold">
	<div>
		FLiMM<br>
		Festival Libre du Moyen-Métrage<br>
		{{ app(\App\Repositories\SettingRepository::class)->get("header.text")?->value }}
	</div>
</header>
