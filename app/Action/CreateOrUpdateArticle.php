<?php

namespace App\Action;

use App\Data\ArticleData;
use App\Models\Article;
use Illuminate\Support\Str;

final readonly class CreateOrUpdateArticle
{
	public function __construct(private UpdateArticleThumbnail $updateArticleThumbnail) { }

	public function execute(Article $article, ArticleData $data): Article
	{
		$article->slug = $data->slug ?: Str::slug(substr($data->title, 0, 64));
		$article->fill($data->toAttributes());

		$article->saveOrFail();

		$this->updateArticleThumbnail->execute($article, $data->thumbnail);

		return $article;
	}
}
