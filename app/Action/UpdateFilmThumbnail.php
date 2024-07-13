<?php

namespace App\Action;

use App\Models\Film;
use Illuminate\Http\UploadedFile;

final readonly class UpdateFilmThumbnail
{
	public function execute(Film $film, UploadedFile|null|false $thumbnail = null): void
	{
		if (null === $thumbnail) {
			return;
		}

		$film->saveThumbnail($thumbnail);
	}
}
