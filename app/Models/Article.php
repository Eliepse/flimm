<?php

namespace App\Models;

use App\EditorJSAttribute;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class Article
 *
 * @package App\Models
 * @property-read int $id
 * @property string $title
 * @property string $slug
 * @property string $excerpt
 * @property EditorJSAttribute|null $content
 * @property Media|null $thumbnail
 * @property Carbon $published_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @method static Builder published()
 */
class Article extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $fillable = [
		"title",
		"slug",
		"excerpt",
		"content",
		"published_at",
	];

	protected $casts = [
		"content" => EditorJSAttribute::class,
	];

	protected $dates = ["published_at"];


	public function getThumbnailAttribute(): ?Media
	{
		return $this->getFirstMedia("thumbnail");
	}


	public function isPublished(): bool
	{
		return $this->published_at && $this->published_at->isPast();
	}


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
			->addMediaCollection("content")
			->useDisk("media");
	}


	public function saveContentImage(string $key): Media
	{
		return $this->addMediaFromRequest($key)
			->usingName(Str::random())
			->sanitizingFileName(fn($fileName) => Str::random(24) . "." . pathinfo($fileName, PATHINFO_EXTENSION))
			->toMediaCollection("content");
	}


	public function saveThumbnail(UploadedFile $thumbnail): Media
	{
		return $this->addMedia($thumbnail)->toMediaCollection("thumbnail");
	}


	public function getContentImages(): Collection
	{
		return collect($this->getMedia("content")->all());
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


	public function clearAllContentImages()
	{
		$this->clearMediaCollection("content");
	}


	public function toArray()
	{
		return array_merge(
			parent::toArray(),
			[
				"thumbnail" => optional($this->thumbnail)->getUrl(),
			]
		);
	}
}
