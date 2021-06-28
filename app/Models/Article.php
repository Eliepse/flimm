<?php

namespace App\Models;

use App\ArticleContent;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
 * @property ArticleContent|null $content
 * @property Carbon $published_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Article extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $fillable = [
		"title",
		"slug",
		"content",
		"published_at",
	];

	protected $casts = [
		"content" => ArticleContent::class,
	];


	public function isPublished(): bool
	{
		return $this->published_at->isPast();
	}


	public function scopePublished(Builder $query): Builder
	{
		return $query->whereDate("published_at", "<=", Carbon::now());
	}


	public function saveContentImage(string $key): Media
	{
		return $this->addMediaFromRequest($key)
			->usingName(Str::random())
			->sanitizingFileName(fn($fileName) => Str::random(24) . "." . pathinfo($fileName, PATHINFO_EXTENSION))
			->toMediaCollection("article_content", "media");
	}


	public function getContentImages(): Collection
	{
		return collect($this->getMedia("article_content")->all());
	}


	public function clearStaleContentImages()
	{
		// We get the uuid of images present in the content
		$uuids = $this->content->getBlocksByType("image")->pluck("data.file.uuid")->toArray();
		$images = $this->getContentImages();

		// Then we get all stored images that we want to keep
		$validImages = $images->filter(fn($media) => in_array($media->uuid, $uuids, true));
		$this->clearMediaCollectionExcept("article_content", $validImages);
	}


	public function clearAllContentImages()
	{
		$this->clearMediaCollection("article_content");
	}
}
