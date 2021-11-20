<?php

namespace App\Models;

use App\Casts\EditorJSCast;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property-read int $id
 * @property string $title
 * @property string $description
 * @property string $session
 * @property ?Edition $edition
 * @property Carbon $start_at
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 */
class Session extends Model
{
	protected $casts = [
		"start_at" => "datetime",
		"description" => EditorJSCast::class,
	];


	public function edition(): BelongsTo
	{
		return $this->belongsTo(Edition::class);
	}


	public function films(): BelongsToMany
	{
		return $this->belongsToMany(Film::class)
			->withPivot(["order"]);
	}
}
