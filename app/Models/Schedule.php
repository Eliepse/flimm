<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Schedule
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
class Schedule extends Model
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


	public function film(): HasMany
	{
		return $this->hasMany(Film::class);
	}
}
