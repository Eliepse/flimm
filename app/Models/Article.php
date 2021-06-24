<?php

namespace App\Models;

use App\ArticleContent;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Article
 *
 * @package App\Models
 * @property-read int $id
 * @property string $title
 * @property string $slug
 * @property ArticleContent $content
 * @property Carbon $published_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Article extends Model
{
	use HasFactory;

	protected $casts = [
		"content" => ArticleContent::class,
	];



	public function isPublished(): bool
	{
		return $this->published_at->isPast();
	}

	public function scopePublished(Builder $query): Builder
	{
		return $query->whereDate("published_at", "<=", Carbon::now());
	}
}
