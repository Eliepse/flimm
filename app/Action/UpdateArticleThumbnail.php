<?php

namespace App\Action;

use App\Models\Article;
use Illuminate\Http\UploadedFile;

final readonly class UpdateArticleThumbnail
{
	public function execute(Article $article, UploadedFile|null|false $thumbnail = null): void
	{
		if (null === $thumbnail) {
			return;
		}

		if (false === $thumbnail) {
			optional($article->thumbnail)->delete();
			return;
		}

		$article->saveThumbnail($thumbnail);
	}
}
