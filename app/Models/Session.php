<?php

namespace App\Models;

use App\Casts\EditorJSCast;
use App\EditorJSAttribute;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property-read int $id
 * @property string $title
 * @property EditorJSAttribute $description
 * @property string $location
 * @property int $duration
 * @property ?int $edition_id
 * @property ?Edition $edition
 * @property-read \Illuminate\Database\Eloquent\Collection $films
 * @property Carbon $start_at
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 */
class Session extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $fillable = ["title", "start_at", "location", "duration", "edition_id", "description"];

	protected $casts = [
		"start_at" => "datetime",
		"edition_id" => "integer",
		"description" => EditorJSCast::class,
	];


	public function edition(): BelongsTo
	{
		return $this->belongsTo(Edition::class);
	}


	public function films(): BelongsToMany
	{
		return $this->belongsToMany(Film::class)
			->orderByPivot("film_order");
	}


	/*
	 * ----------------
	 * Medias
	 * ----------------
	 */

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection("content")->useDisk("media");
	}


	public function saveContentImage(string $key): Media
	{
		return $this->addMediaFromRequest($key)
			->usingName(Str::random())
			->sanitizingFileName(fn($fileName) => Str::random(24) . "." . pathinfo($fileName, PATHINFO_EXTENSION))
			->toMediaCollection("content");
	}


	public function clearStaleContentImages()
	{
		// We get the uuid of images present in the content
		$uuids = $this->content->getBlocksByType("image")->pluck("data.file.uuid")->toArray();
		$images = $this->getContentImages();

		// Then we get all stored images that we want to keep
		$validImages = $images->filter(fn($media) => in_array($media->uuid, $uuids, true));
		$this->clearMediaCollectionExcept("content", $validImages);
	}


	public function getContentImages(): Collection
	{
		return collect($this->getMedia("content")->all());
	}


	public function clearAllContentImages()
	{
		$this->clearMediaCollection("content");
	}

}
