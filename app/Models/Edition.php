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

	protected $fillable = ["title", "slug", "presentation", "open_at", "close_at", "published_at"];

	protected $casts = [
		"open_at" => "date",
		"close_at" => "date",
		"published_at" => "datetime",
	];


	public function scopePublished(Builder $query): Builder
	{
		return $query->whereDate("published_at", "<=", Carbon::now());
	}


	public function registerMediaCollections(): void
	{
		$this
			->addMediaCollection('thumbnail')
			->useDisk("media")
			->singleFile();

		$this
			->addMediaCollection('program')
			->useDisk("media")
			->singleFile();
	}


	/** @noinspection PhpUnused */
	public function getThumbnailAttribute(): ?Media
	{
		return $this->getFirstMedia("thumbnail");
	}


	/** @noinspection PhpUnused */
	public function getProgramAttribute(): ?Media
	{
		return $this->getFirstMedia("program");
	}


	public function saveThumbnail(UploadedFile $thumbnail): Media
	{
		return $this->addMedia($thumbnail)->toMediaCollection("thumbnail");
	}


	public function saveProgram(UploadedFile $program): Media
	{
		return $this->addMedia($program)->toMediaCollection("program");
	}


	public function removeThumbnail()
	{
		$this->clearMediaCollection("thumbnail");
	}


	public function removeProgram()
	{
		$this->clearMediaCollection("program");
	}


	public function schedules(): HasMany
	{
		return $this->hasMany(Schedule::class);
	}


	public function films(): HasManyThrough
	{
		return $this->hasManyThrough(Film::class, Schedule::class);
	}


	public function toArray(): array
	{
		$appends = [];

		if ($program = $this->program) {
			$appends["program"] = [
				"name" => $program->file_name,
				"url" => $program->getUrl(),
			];
		}

		if ($thumbnail = $this->thumbnail) {
			$appends["thumbnail"] = [
				"name" => $thumbnail->file_name,
				"url" => $thumbnail->getUrl(),
			];
		}

		return array_merge(parent::toArray(), $appends);
	}
}
