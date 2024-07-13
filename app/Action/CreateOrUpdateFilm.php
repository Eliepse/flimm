<?php

namespace App\Action;

use App\Data\FilmData;
use App\Models\Film;

final readonly class CreateOrUpdateFilm
{
	public function __construct(private readonly UpdateFilmThumbnail $updateFilmThumbnail) { }

	public function execute(Film $film, FilmData $data): Film
	{
		$film->fill($data->toAttributes());
		$film->saveOrFail();

		$this->updateFilmThumbnail->execute($film, $data->thumbnail);

		return $film;
	}
}
