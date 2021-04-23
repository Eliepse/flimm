<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * Class Film
 *
 * @package App\Models
 * @property-read int $id
 * @property string $title
 * @property int $duration
 * @property string $synopsis
 * @property string $description
 * @property string $video_link
 * @property string $imdb_link
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection $schedules
 * @property-read Collection $editions
 */
class Film extends Model
{
	use HasFactory;

	protected $fillable = [
		"title",
		"duration",
		"synopsis",
		"description",
		"video_link",
		"imdb_link",
	];


	public function schedules(): HasMany
	{
		return $this->hasMany(FilmSchedule::class);
	}


	public function edtions(): HasManyThrough
	{
		return $this->hasManyThrough(Edition::class, FilmSchedule::class);
	}
}
