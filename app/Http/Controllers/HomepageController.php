<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Repositories\SettingRepository;
use Illuminate\Contracts\View\View;

class HomepageController
{
	public function __invoke(SettingRepository $settings): View
	{
		$actus = Article::published()
			->orderBy("published_at", "desc")
			->limit(6)
			->get(["id", "title", "slug", "published_at"]);

		return view("welcome", ["actus" => $actus, "settings" => $settings]);
	}
}
