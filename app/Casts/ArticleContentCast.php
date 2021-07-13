<?php


namespace App\Casts;


use App\ArticleContent;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class ArticleContentCast implements CastsAttributes
{
	public function get($model, string $key, $value, array $attributes): ?ArticleContent
	{
		if(is_null($value)) {
			return null;
		}

		if (is_string($value)) {
			$value = json_decode($value, true);
		}

		return new ArticleContent($value);
	}


	public function set($model, string $key, $value, array $attributes): ?string
	{
		if (empty($value)) {
			return null;
		}

		if (is_array($value)) {
			$value = new ArticleContent($value);
		}

		if (! $value instanceof ArticleContent) {
			throw new \InvalidArgumentException('The given value is not an ArticleContent instance.');
		}

		return $value->toJson();
	}
}