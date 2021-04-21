<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class FilmMember
 *
 * @package App\Models
 * @property-read int $id
 * @property string $firstname
 * @property string $lastname
 * @property Collection $films
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class FilmMember extends Model
{
	use HasFactory;

	protected $fillable = ["firstname", "lastname"];


	public function films(): BelongsToMany
	{
		return $this->belongsToMany(Film::class)
			->withPivot(["title", "order"]);
	}
}
