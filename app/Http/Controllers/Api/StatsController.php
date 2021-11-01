<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use App\Models\Edition;
use App\Models\Film;
use Illuminate\Http\JsonResponse;

class StatsController
{
	public function home(): JsonResponse
	{
		return response()->json([
			"articlesCount" => Article::query()->count(),
			"editionsCount" => Edition::query()->count(),
			"filmsCount" => Film::query()->count(),
		]);
	}
}