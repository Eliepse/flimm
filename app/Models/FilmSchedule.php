<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class FilmSchedule
 *
 * @package App\Models
 * @property-read int $id
 * @property-read Edition $edition
 * @property-read Film $film
 * @property array $content
 * @property Carbon $start_at
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 */
class FilmSchedule extends Model
{
	use HasFactory;

	protected $fillable = ["start_at", "film_id", "edition_id"];

	protected $casts = [
		"start_at" => "datetime",
	];


	public function edition(): BelongsTo
	{
		return $this->belongsTo(Edition::class);
	}


	public function film(): BelongsTo
	{
		return $this->belongsTo(Film::class);
	}
}
