<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class Edition
 *
 * @package App\Models
 * @property-read int $id
 * @property  string $title
 * @property  string $slug
 * @property  string $presentation
 * @property Media|null $thumbnail
 * @property Media|null $program
 * @property Media|null $poster
 * @property Media|null $brochure
 * @property Media|null $flyer
 * @property  string $teaser_link
 * @property  Carbon $open_at
 * @property  Carbon $close_at
 * @property  Carbon $published_at
 * @property-read  Carbon $created_at
 * @property-read  Carbon $updated_at
 * @property-read Collection $schedules
 * @property-read Collection $films
 * @method static Builder published()
 */
class Edition extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $fillable = ["title", "slug", "presentation", "teaser_link", "open_at", "close_at", "published_at"];

	protected $casts = [
		"open_at" => "date",
		"close_at" => "date",
		"published_at" => "datetime",
	];


	public function scopePublished(Builder $query): Builder
	{
		return $query->whereDate("published_at", "<=", Carbon::now());
	}

	/*
	 * ----------------
	 * Getters
	 * ----------------
	 */

	/** @noinspection PhpUnused */
	public function getProgramAttribute(): ?Media
	{
		return $this->getFirstMedia("program");
	}


	/** @noinspection PhpUnused */
	public function getThumbnailAttribute(): ?Media
	{
		return $this->getFirstMedia("thumbnail");
	}


	/** @noinspection PhpUnused */
	public function getPosterAttribute(): ?Media
	{
		return $this->getFirstMedia("poster");
	}


	/** @noinspection PhpUnused */
	public function getBrochureAttribute(): ?Media
	{
		return $this->getFirstMedia("brochure");
	}


	/** @noinspection PhpUnused */
	public function getFlyerAttribute(): ?Media
	{
		return $this->getFirstMedia("flyer");
	}


	/*
	 * ----------------
	 * Medias
	 * ----------------
	 */

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection('thumbnail')->useDisk("media")->singleFile();
		$this->addMediaCollection('program')->useDisk("media")->singleFile();
		$this->addMediaCollection('poster')->useDisk("media")->singleFile();
		$this->addMediaCollection('brochure')->useDisk("media")->singleFile();
		$this->addMediaCollection('flyer')->useDisk("media")->singleFile();
	}


	public function saveThumbnail(UploadedFile $thumbnail): Media
	{
		return $this->addMedia($thumbnail)->toMediaCollection("thumbnail");
	}


	public function saveProgram(UploadedFile $program): Media
	{
		return $this->addMedia($program)->toMediaCollection("program");
	}


	public function savePoster(UploadedFile $program): Media
	{
		return $this->addMedia($program)->toMediaCollection("poster");
	}


	public function saveBrochure(UploadedFile $program): Media
	{
		return $this->addMedia($program)->toMediaCollection("brochure");
	}


	public function saveFlyer(UploadedFile $program): Media
	{
		return $this->addMedia($program)->toMediaCollection("flyer");
	}


	public function removeThumbnail()
	{
		$this->clearMediaCollection("thumbnail");
	}


	public function removeProgram()
	{
		$this->clearMediaCollection("program");
	}


	public function removePoster()
	{
		$this->clearMediaCollection("poster");
	}


	public function removeBrochure()
	{
		$this->clearMediaCollection("brochure");
	}


	public function removeFlyer()
	{
		$this->clearMediaCollection("flyer");
	}


	/*
	 * ----------------
	 * Relations
	 * ----------------
	 */


	public function schedules(): HasMany
	{
		return $this->hasMany(Schedule::class);
	}


	public function films(): HasManyThrough
	{
		return $this->hasManyThrough(Film::class, Schedule::class);
	}


	/*
	 * ----------------
	 * Misc
	 * ----------------
	 */

	public function toArray(): array
	{
		$appends = [];

		function appendExistingFile(&$appends, $name, $value)
		{
			if (! $value) {
				return;
			}

			$appends[$name] = [
				"name" => $value->file_name,
				"url" => $value->getUrl(),
			];
		}

		appendExistingFile($appends, "thumbnail", $this->thumbnail);
		appendExistingFile($appends, "program", $this->program);
		appendExistingFile($appends, "poster", $this->poster);
		appendExistingFile($appends, "brochure", $this->brochure);
		appendExistingFile($appends, "flyer", $this->flyer);

		return array_merge(parent::toArray(), $appends);
	}
}
