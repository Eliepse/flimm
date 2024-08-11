<?php

namespace App\Action;

use App\Data\FilmData;
use App\Models\Film;

final readonly class PersistFilm
{
	public function __construct(private UpdateFilmThumbnail $updateFilmThumbnail) { }

	public function execute(Film $film, FilmData $data): Film
	{
		$film->fill($data->toAttributes());
		$film->saveOrFail();

		$this->updateFilmThumbnail->execute($film, $data->thumbnail);

		return $film;
	}
}
