<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $name
 * @property-read Carbon $createdAt
 * @property-read Carbon $updatedAt
 * @property-read Edition $edition
 * @property-read Collection|Film[] $films
 */
class Selection extends Model
{
	use HasFactory;

	protected $fillable = ["name"];

	protected $with = ["films"];


	public function edition(): BelongsTo
	{
		return $this->belongsTo(Edition::class);
	}


	public function films(): BelongsToMany
	{
		return $this->belongsToMany(Film::class);
	}
}
