<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property-read int $id
 * @property string $name
 * @property string $intro
 * @property-read int $edition_id
 * @property-read Carbon $createdAt
 * @property-read Carbon $updatedAt
 * @property-read Edition $edition
 * @property-read Collection|Film[] $films
 */
class Selection extends Model
{
	use HasFactory;

	protected $fillable = ["name", "intro"];


	public function edition(): BelongsTo
	{
		return $this->belongsTo(Edition::class);
	}


	public function films(): BelongsToMany
	{
		return $this->belongsToMany(Film::class)
			->orderByPivot("film_order");
	}
}
