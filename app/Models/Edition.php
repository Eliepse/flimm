<?php

namespace App\Models;

use App\Casts\EditorJSCast;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
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
		"presentation" => EditorJSCast::class,
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
		$this->addMediaCollection("content")->useDisk("media");
	}


	public function saveContentImage(string $key): Media
	{
		return $this->addMediaFromRequest($key)
			->usingName(Str::random())
			->sanitizingFileName(fn($fileName) => Str::random(24) . "." . pathinfo($fileName, PATHINFO_EXTENSION))
			->toMediaCollection("content");
	}


	public function getContentImages(): \Illuminate\Support\Collection
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


	/*
	 * ----------------
	 * Misc
	 * ----------------
	 */

	public function toArray(): array
	{
		$appends = [];

		if ($this->thumbnail) {
			$appends["thumbnail"] = [
				"name" => $this->thumbnail->file_name,
				"url" => $this->thumbnail->getUrl(),
			];
		}

		if ($this->program) {
			$appends["program"] = [
				"name" => $this->program->file_name,
				"url" => $this->program->getUrl(),
			];
		}

		if ($this->poster) {
			$appends["poster"] = [
				"name" => $this->poster->file_name,
				"url" => $this->poster->getUrl(),
			];
		}

		if ($this->brochure) {
			$appends["brochure"] = [
				"name" => $this->brochure->file_name,
				"url" => $this->brochure->getUrl(),
			];
		}

		if ($this->flyer) {
			$appends["flyer"] = [
				"name" => $this->flyer->file_name,
				"url" => $this->flyer->getUrl(),
			];
		}

		return array_merge(parent::toArray(), $appends);
	}
}
