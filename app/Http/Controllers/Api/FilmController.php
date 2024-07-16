<?php

namespace App\Http\Controllers\Api;

use App\Action\PersistFilm;
use App\Data\FilmData;
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

		if (! empty($title = $request->get("title"))) {
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


	public function store(StoreFilmRequest $request, PersistFilm $action): Film
	{
		$data = FilmData::fromFormRequest($request);
		return $action->execute(new Film(), $data);
	}


	public function update(StoreFilmRequest $request, Film $film, PersistFilm $action): Film
	{
		$data = FilmData::fromFormRequest($request);
		$action->execute($film, $data);

		$film->load("media");

		return $film;
	}
}
