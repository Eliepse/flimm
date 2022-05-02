<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class Film
 *
 * @package App\Models
 * @property-read int $id
 * @property string $title
 * @property string $slug
 * @property string|null $title_override
 * @property int $duration
 * @property string|null $synopsis
 * @property string|null $description
 * @property string $filmmaker
 * @property string|null $technical_members
 * @property string|null $gender
 * @property string $year
 * @property string|null $production_name
 * @property string|null $country
 * @property string|null $other_technical_infos
 * @property string|null $website_link
 * @property string|null $video_link
 * @property string|null $trailer_link
 * @property string|null $imdb_id
 * @property Media|null $thumbnail
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection $schedules
 * @property-read Collection $editions
 */
class Film extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $guarded = ["thumbnail"];


	public function schedules(): BelongsToMany
	{
		return $this->belongsToMany(Session::class);
	}


	public function registerMediaCollections(): void
	{
		$this
			->addMediaCollection('thumbnail')
			->useDisk("media")
			->singleFile();
	}


	public function getThumbnailAttribute(): ?Media
	{
		return $this->getFirstMedia("thumbnail");
	}


	public function saveThumbnail(UploadedFile $thumbnail = null): ?Media
	{
		if (is_null($thumbnail)) {
			$this->clearMediaCollection("thumbnail");
			return null;
		}

		return $this->addMedia($thumbnail)->toMediaCollection("thumbnail");
	}


	public function toArray(): array
	{
		return array_merge(
			parent::toArray(),
			[
				"thumbnail" => optional($this->thumbnail)->getUrl(),
			]
		);
	}
}
