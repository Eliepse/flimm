<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFilmRequest;
use App\Models\Film;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class FilmController extends Controller
{
	public function index(Request $request): Collection
	{
		$query = Film::query();

		$title = $request->get("title");
		if ($request->has("title") && ! empty($title)) {
			$query->where("title", "like", "%$title%");
			$query->orderBy("title");
			$query->limit(5);
		}

		return $query->get();
	}


	public function show(Film $film): Film
	{
		return $film;
	}


	public function store(StoreFilmRequest $request): Film
	{
		$film = new Film($request->validated());
		$film->save();

		return $film;
	}


	public function update(StoreFilmRequest $request, Film $film): Film
	{
		$film->fill($request->validated());
		$film->saveThumbnail($request->file("thumbnail"));
		$film->save();

		return $film;
	}
}
