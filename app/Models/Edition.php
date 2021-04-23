<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * Class Edition
 *
 * @package App\Models
 * @property-read int $id
 * @property  string $title
 * @property  string $slug
 * @property  array $content
 * @property  Carbon $open_at
 * @property  Carbon $close_at
 * @property  Carbon $published_at
 * @property-read  Carbon $created_at
 * @property-read  Carbon $updated_at
 * @property-read Collection $schedules
 * @property-read Collection $films
 */
class Edition extends Model
{
	use HasFactory;

	protected $fillable = ["title", "slug", "content", "open_at", "close_at", "published_at"];

	protected $casts = [
		"content" => "array",
		"open_at" => "date",
		"close_at" => "date",
		"published_at" => "datetime",
	];


	public function schedules(): HasMany
	{
		return $this->hasMany(FilmSchedule::class);
	}


	public function films(): HasManyThrough
	{
		return $this->hasManyThrough(Film::class, FilmSchedule::class);
	}
}
