<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
